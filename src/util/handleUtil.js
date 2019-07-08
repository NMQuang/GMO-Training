import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';
import common from '../common/common';
import message from '../constants/message';
import ApiResponseError from '../common/ApiResponseError';
import security from '../auth/security';
import MessageResponse from '../common/MessageResponse';
import resultCode from '../constants/resultCode';
import ApiResponseSuccess from '../common/ApiResponseSuccess';

var handleUtil = {}

/** authorization */
handleUtil.authorization = async (req, res, next) => {

    // get original url
    const urlOri = req.originalUrl;
    var url = urlOri;

    // split url if url containt a numeric
    if (/\d/.test(urlOri)) {
        url = urlOri.substring(0, urlOri.lastIndexOf('/'));
    }

    /**
     * authentication url
     * if true: authentication url
     * if false: don't authenticate url
     */
    if (security.authenticationUrl.includes(url)) {
        const accessToken = req.headers['x-access-token'] || req.headers['authorization']; //todo

        try {
            if (!accessToken) {
                let apiAuth = new ApiResponseError();
                apiAuth.data = {};
                apiAuth.message = common.parseMessage(message.MSG_AUTH_1, ['token']);
                return res.status(401).json({
                    ...apiAuth,
                    'auth': false
                });
            }
            // verify access token
            const decoded = await jwt.verify(accessToken, authConfig.secretToken);
            // check access token expired or not
            if (decoded.exp * 1000 <= Date.now()) {
                let apiAuth = new ApiResponseError();
                apiAuth.data = {};
                apiAuth.message = common.parseMessage(message.MSG_AUTH_4, ['token']);
                return res.status(401).json({
                    ...apiAuth,
                    'auth': false
                });
            }

            // set user and access token for request
            req.accessToken = accessToken;
            req.user = decoded.user[0];

            // go to middleware: getUser
            next();
        } catch (error) {
            // handle error system
            handleUtil.exceptionSystem(error, next);
        }
    } else {
        next();
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
    }
    error.resultCode = resultCode.CODE_ERROR;
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
 * @param {} next
 * @return {} next to middeware
 */
handleUtil.exceptionAuthentication = (next) => {
    let error = {};
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
            break;
        }

        // error sql query
        case resultCode.CODE_ERROR_SQL: {
            responseError.message = common.parseMessage(message.MSG_ERROR_5, ['error']);
            responseError.resultCode = resultCode.CODE_ERROR;
            let err = new MessageResponse(error.name, error.original.sqlMessage);
            responseError.error = err;
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
            break;
        }

        // error data not found 
        case resultCode.CODE_ERROR_NOTFOUND: {
            responseError.message = common.parseMessage(message.MSG_ERROR_6, ['']);
            responseError.resultCode = resultCode.CODE_ERROR_NOTFOUND;
            responseError.error = [];
            break;
        }

        // error authentication
        case resultCode.CODE_ERROR_AUTHENTICATION: {
            responseError.message = common.parseMessage(message.MSG_AUTH_3, ['refresh token']);
            responseError.resultCode = resultCode.CODE_ERROR_AUTHENTICATION;
            responseError.error = [];
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
    return res.json(responseSuccess);
}

export default handleUtil;