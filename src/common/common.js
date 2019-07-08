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

export default common;