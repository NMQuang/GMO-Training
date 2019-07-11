import handleError from "../handlers/handleError";
import handleSuccess from "../handlers/handleSuccess";
import log from "../loggers/log";

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
 * split a string
 * @param {String} url
 * @param {String} op
 * @return {String} splited string
 */
common.splitString = (url, op) => url.substring(0, url.lastIndexOf(op));

/**
 * check a string contain numeric or not
 * @param {String} str
 * @return {Boolean}
 */
common.checkContain = (str => /\d/.test(str));


/**
 * handle process data
 * @param {MessageResponse} messageResponse
 * @param {} req
 * @param {} res
 * @param {} next
 * @param {function} callback
 */
common.processData = async (messageResponse, req, res, next, callback) => {
    try {
        // handle callback: process data
        const result = await callback();
        if (result > 0 || result.length > 0) {
            // handle when successful
            handleSuccess.processSuccess(result, messageResponse, req, res);
        } else {
            // handle error when data not found
            handleError.exceptionNotFound(next);
        }
    } catch (error) {
        // write log error
        log.error(error.message);
        // handle error system
        handleError.exceptionSystem(error, next);
    }
};

/**
 * copy value from object: inputObj to another object: outputObj
 * @param {Object} inputObj
 * @param {Object} outputObj
 * @param {String} param: option
 * @return {Object} outputObj
 */
common.copyValueObject = (inputObj, outputObj, param) => {

    if (typeof param === 'undefined') {
        let listColumn = Object.keys(outputObj);
        Object.keys(inputObj).forEach(key => {
            if (listColumn.includes(key)) {
                outputObj[key] = inputObj[key];
            }
        });
    } else {
        outputObj = {
            ...inputObj,
            param
        };
    }
    return outputObj;
};

/**
 * copy value from list to another list
 * @param {List} inputList
 * @param {Object} outputObj
 * @return {List} new list
 */
common.copyValueList = (inputList, outputObj) => {
    let result = [];
    inputList.forEach(obj => {
        result.push(common.copyValueObject(obj, outputObj));
    });
    return result;
}

export default common;