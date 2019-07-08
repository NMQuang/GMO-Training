import {
    body
} from 'express-validator';
import message from '../constants/message.js'
import common from '../common/common.js'
import validatorUtil from '../util/validatorUtil.js';

const productsValidator = {};

// check input value of model: product
productsValidator.validate = [

    // check value of name
    body('name')
    .exists()
    .isLength({
        min: 1,
        max: 255
    }).withMessage(common.parseMessage(message.MSG_ERR_3, ['name', '1', '255']))
    .trim(),

    // check value of price
    body('price')
    .exists()
    .isInt().withMessage(common.parseMessage(message.MSG_ERR_1, ['price']))
    .isLength({
        min: 1,
        max: 11
    }).withMessage(common.parseMessage(message.MSG_ERR_3, ['price', '1', '11']))
    .trim(),

    // check value of status
    body('status')
    .exists()
    .isInt().withMessage(common.parseMessage(message.MSG_ERR_1, ['status']))
    .isLength({
        min: 1,
        max: 11
    }).withMessage(common.parseMessage(message.MSG_ERR_3, ['status', '1', '11']))
    .trim(),

    // check value of image
    body('image')
    .exists()
    .isLength({
        min: 1,
        max: 255
    }).withMessage(common.parseMessage(message.MSG_ERR_3, ['image', '1', '11']))
    .trim(),

    // middleware validate
    validatorUtil.validate
];

export default productsValidator;