import {
    body
} from 'express-validator';
import message from '../constants/message.js'
import common from '../common/common.js'
import validatorUtil from '../util/validatorUtil.js';

const userValidator = {};

// check input value of model: user
userValidator.validate = [
    // check value of email
    body('email')
    .exists()
    .isEmail().withMessage(common.parseMessage(message.MSG_ERROR_4, ['email']))
    .isLength({
        min: 1,
        max: 255
    }).withMessage(common.parseMessage(message.MSG_ERROR_3, ['email', '1', '255']))
    .trim(),

    // check value of password
    body('password')
    .exists()
    .isLength({
        min: 1,
        max: 255
    }).withMessage(common.parseMessage(message.MSG_ERROR_3, ['password', '1', '255']))
    .trim(),

    // middleware validate
    validatorUtil.validate
];

export default userValidator;