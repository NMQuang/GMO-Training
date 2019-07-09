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

export default common;