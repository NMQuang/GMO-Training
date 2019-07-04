import {
    body
} from 'express-validator';
import constant from '../constants/message.js'
import common from '../common/common.js'

var userValidator = {};

// check input value of model: user
userValidator.checkValueUser = [
    // check value of email
    body('email')
    .exists()
    .isEmail().withMessage(common.parseMessage(constant.MSG_ERROR_4, ['email']))
    .isLength({
        min: 1,
        max: 255
    }).withMessage(common.parseMessage(constant.MSG_ERROR_3, ['email', '1', '255']))
    .trim(),

    // check value of password
    body('password')
    .exists()
    .isLength({
        min: 1,
        max: 255
    }).withMessage(common.parseMessage(constant.MSG_ERROR_3, ['password', '1', '255']))
    .trim(),
];

export default userValidator;