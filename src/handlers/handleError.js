import common from '../common/common';
import message from '../constants/message';
import ApiResponseError from '../common/ApiResponseError';
import MessageResponse from '../common/MessageResponse';
import resultCode from '../constants/resultCode';
import status from '../constants/status';

// handle error
const handleError = {};

/**
 * handle error when data not found
 * @param {} next
 * @return {} next to middeware
 */
handleError.exceptionNotFound = (next) => {
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
handleError.exceptionSystem = (error, next) => {
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
handleError.exceptionValidate = (error, next) => {
    error.resultCode = resultCode.CODE_ERROR_VALIDATE;
    next(error);
}

/**
 * handle error token
 * @param {MessageResponse} message
 * @param {} next
 * @return {} next to middeware
 */
handleError.exceptionAuthentication = (message, next) => {
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
handleError.processError = (error, req, res, next) => {

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

export default handleError;