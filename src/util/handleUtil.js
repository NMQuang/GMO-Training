import authConfig from '../config/auth';
import common from '../common/common';
import message from '../constants/message';
import ApiResponseError from '../common/ApiResponseError';
import security from '../auth/security';
import MessageResponse from '../common/MessageResponse';
import resultCode from '../constants/resultCode';
import ApiResponseSuccess from '../common/ApiResponseSuccess';
import jwtUtil from './jwtUtil';
import status from '../constants/status';

/**
 * handle common:
 * authentication
 * exception
 * error
 * success
 */
var handleUtil = {}

/**
 * authorization
 * @param {} req
 * @param {} res
 * @param {} next
 */
handleUtil.authorization = async (req, res, next) => {

    // get original url
    const urlOri = req.originalUrl;
    var url = urlOri;

    // split url if url contain a numeric
    if (common.checkContain(urlOri)) {
        url = common.splitString(urlOri);
    }

    /**
     * authentication url
     * if true: don't need to authenticate url
     * if false: must authentication url
     */
    if (security.authenticationUrl.includes(url)) {
        next();
    } else {
        const accessToken = req.headers['x-access-token'];

        try {
            if (!accessToken) {

                // handle error authentication when don't have token
                let messageResponse = new MessageResponse(['token'], message.MSG_AUTH_1);
                handleUtil.exceptionAuthentication(messageResponse, next);
            } else {
                // verify access token
                const decoded = await jwtUtil.verifyToken(accessToken, authConfig.secretToken);
                // check access token expired or not
                if (decoded.exp * 1000 <= Date.now()) {

                    // handle error authentication when toke is expired
                    let messageResponse = new MessageResponse(['token'], message.MSG_AUTH_4);
                    handleUtil.exceptionAuthentication(messageResponse, next);
                } else {

                    // set user and access token for request
                    req.accessToken = accessToken;
                    req.user = decoded.user[0];

                    // go to middleware: getUser
                    next();
                }
            }
        } catch (error) {
            // handle error system
            handleUtil.exceptionSystem(error, next);
        }
    }
};

/**
 * handle error when data not found
 * @param {} next
 * @return {} next to middeware
 */
handleUtil.exceptionNotFound = (next) => {
    let error = {};
    error.resultCode = resultCode.CODE_ERROR_NOTFOUND;
    next(error);
};

/**
 * handle error system
 * @param {} error
 * @param {} next
 * @return {} next to middeware
 */
handleUtil.exceptionSystem = (error, next) => {
    if (error.name === 'SequelizeDatabaseError') {
        error.resultCode = resultCode.CODE_ERROR_SQL;
    } else if (error.name === 'JsonWebTokenError') {
        error.resultCode = resultCode.CODE_ERROR_TOKEN;
    } else {
        error.resultCode = resultCode.CODE_ERROR;
    }
    next(error);
};

/**
 * handle error validate
 * @param {} error
 * @param {} next
 * @return {} next to middeware
 */
handleUtil.exceptionValidate = (error, next) => {
    error.resultCode = resultCode.CODE_ERROR_VALIDATE;
    next(error);
}

/**
 * handle error token
 * @param {MessageResponse} message
 * @param {} next
 * @return {} next to middeware
 */
handleUtil.exceptionAuthentication = (message, next) => {
    let error = {};
    error.message = message;
    error.resultCode = resultCode.CODE_ERROR_AUTHENTICATION;
    next(error);
}

/**
 * handle message error
 * @param {} error
 * @param {} req
 * @param {} res
 * @param {} next
 * @return {ApiResponseError} a message error
 */
handleUtil.error = (error, req, res, next) => {

    var responseError = new ApiResponseError();
    // control result code of error
    switch (error.resultCode) {

        // error system
        case resultCode.CODE_ERROR: {
            responseError.message = common.parseMessage(message.MSG_ERROR_5, ['error']);
            responseError.resultCode = resultCode.CODE_ERROR;
            let err = new MessageResponse(error.name, error.message);
            responseError.error = err;
            res.status(status.STT_ERROR_NOTFOUND);
            break;
        }

        // error token
        case resultCode.CODE_ERROR_TOKEN: {
            responseError.message = common.parseMessage(message.MSG_AUTH_2, ['token']);
            responseError.resultCode = resultCode.CODE_ERROR_TOKEN;
            let err = new MessageResponse(error.name, error.message);
            responseError.error = err;
            res.status(status.STT_ERROR_AUTH);
            break;
        }

        // error sql query
        case resultCode.CODE_ERROR_SQL: {
            responseError.message = common.parseMessage(message.MSG_ERROR_5, ['error']);
            responseError.resultCode = resultCode.CODE_ERROR;
            let err = new MessageResponse(error.name, error.original.sqlMessage);
            responseError.error = err;
            res.status(status.STT_ERROR_BAD);
            break;
        }

        // error validate
        case resultCode.CODE_ERROR_VALIDATE: {
            responseError.message = common.parseMessage(message.MSG_ERROR_5, ['error']);
            responseError.resultCode = resultCode.CODE_ERROR_VALIDATE;
            let err = error.errors.map(err => {
                return new MessageResponse(err.param, err.msg);
            });
            responseError.error = err;
            res.status(status.STT_ERROR_CREATE);
            break;
        }

        // error data not found 
        case resultCode.CODE_ERROR_NOTFOUND: {
            responseError.message = common.parseMessage(message.MSG_ERROR_6, ['']);
            responseError.resultCode = resultCode.CODE_ERROR_NOTFOUND;
            responseError.error = [];
            res.status(status.STT_ERROR_NOTFOUND);
            break;
        }

        // error authentication
        case resultCode.CODE_ERROR_AUTHENTICATION: {
            responseError.message = common.parseMessage(error.message.msg, error.message.param);
            responseError.resultCode = error.resultCode;
            responseError.error = [];
            res.status(status.STT_ERROR_AUTH);
            break;
        }
        default: {
            responseError.message = error;
            break;
        }
    }
    return res.json(responseError);
}

/**
 * handle when process is successful
 * @param {Object} data
 * @param {MessageResponse} info message
 * @param {} req
 * @param {} res
 * @return {ApiResponseSuccess} 
 */
handleUtil.success = (data, messageResponse, req, res) => {
    const responseSuccess = new ApiResponseSuccess();
    responseSuccess.data = data;
    responseSuccess.resultCode = resultCode.CODE_SUCCESS;
    responseSuccess.message = common.parseMessage(messageResponse.msg, [messageResponse.param]);
    res.status(status.STT_SUCCESS_OK);
    return res.json(responseSuccess);
}

export default handleUtil;