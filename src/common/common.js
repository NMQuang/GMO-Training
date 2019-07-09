import handleUtil from "../util/handleUtil";

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
 * @return {String} splited string
 */
common.splitString = (url => url.substring(0, url.lastIndexOf('/')));

/**
 * check a string contain numeric or not
 * @param {String} str
 * @return {Boolean}
 */
common.checkContain = (str => /\d/.test(str));

common.processData = async (messageResponse, req, res, next, callback) => {
    try {

        // handle callback: process data
        const result = await callback();
        if (result > 0 || result.length > 0) {
            // handle when successful
            handleUtil.success(result, messageResponse, req, res);
        } else {
            // handle error when data not found
            handleUtil.exceptionNotFound(next);
        }
    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
    }
};

export default common;