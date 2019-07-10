import handleError from "../handlers/handleError";
import handleSuccess from "../handlers/handleSuccess";

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
        // handle error system
        handleError.exceptionSystem(error, next);
    }
};

// common.handleSql = sql => {
//     const sqlCount = 'COUNT(*)';
//     common.splitString(sql,'FROM');
//     return sql.replace(common.splitString(sql,'FROM'), () => param[i++]);
// };

export default common;