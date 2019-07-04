import {
    validationResult
} from 'express-validator';
import ApiResponseError from '../common/ApiResponseError';

var common = {};

/**
 * parse message with dynamic param
 * @param {String} message
 * @param {String[]} param
 * @return {String} parsed message 
 */
common.parseMessage = (message, param) => {
    if (message === undefined || message === null || message.indexOf('%p') < 0) {
        return '';
    }
    let i = 0;
    return message.replace(/%p/g, () => param[i++]);
}

/**
 * check validate
 * @param {} req
 * @param {} res
 * @param {} next
 * @return {} error
 */
common.checkValidation = (req, res, next) => {
    var errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
        let errorList = errorValidation.errors.map(err => {
            return {
                'param': err.param,
                'msg': err.msg
            };
        });
        let api = new ApiResponseError();
        api.data = {};
        api.message = errorList;
        return res.status(400).json({
            api
        });
    }
    next();
}
export default common;