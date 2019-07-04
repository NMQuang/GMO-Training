import {
    body
} from 'express-validator';
import constant from '../constants/message.js'
import common from '../common/common.js'

var userValidator = {};

userValidator.checkValueUser = [
    body('email')
    .exists()
    .isEmail().withMessage(common.parseMessage(constant.MSG_ERROR_4, ['email']))
    .isLength({
        min: 1,
        max: 255
    }).withMessage(common.parseMessage(constant.MSG_ERROR_3, ['email', '1', '255']))
    .trim(),
    body('password')
    .exists()
    .isLength({
        min: 1,
        max: 255
    }).withMessage(common.parseMessage(constant.MSG_ERROR_3, ['password', '1', '255']))
    .trim(),
];

export default userValidator;