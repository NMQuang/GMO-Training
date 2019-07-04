import {
    body
} from 'express-validator';
import constant from '../constants/message.js'
import common from '../common/common.js'

var productValidator = {};

// check input value of model: product
productValidator.checkValueProduct = [

    // check value of name
    body('name')
    .exists()
    .isLength({
        min: 1,
        max: 255
    }).withMessage(common.parseMessage(constant.MSG_ERR_3, ['name', '1', '255']))
    .trim(),

    // check value of price
    body('price')
    .exists()
    .isInt().withMessage(common.parseMessage(constant.MSG_ERR_1, ['price']))
    .isLength({
        min: 1,
        max: 11
    }).withMessage(common.parseMessage(constant.MSG_ERR_3, ['price', '1', '11']))
    .trim(),

    // check value of status
    body('status')
    .exists()
    .isInt().withMessage(common.parseMessage(constant.MSG_ERR_1, ['status']))
    .isLength({
        min: 1,
        max: 11
    }).withMessage(common.parseMessage(constant.MSG_ERR_3, ['status', '1', '11']))
    .trim(),

    // check value of image
    body('image')
    .exists()
    .isLength({
        min: 1,
        max: 255
    }).withMessage(common.parseMessage(constant.MSG_ERR_3, ['image', '1', '11']))
    .trim(),
];

export default productValidator;