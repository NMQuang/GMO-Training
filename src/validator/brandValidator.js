import {
    body
} from 'express-validator';
import constant from '../constants/message.js'
import common from '../common/common.js'

var brandValidator = {};

brandValidator.checkValueBrand = [

    body('name')
    .exists()
    .isAlpha().withMessage(common.parseMessage(constant.MSG_ERROR_2, ['name']))
    .isLength({
        min: 1,
        max: 255
    }).withMessage(common.parseMessage(constant.MSG_ERROR_3, ['name', '1', '255']))
    .trim(),
    body('company')
    .exists()
    .isAlpha().withMessage(common.parseMessage(constant.MSG_ERROR_2, ['company']))
    .isLength({
        min: 1,
        max: 50
    }).withMessage(common.parseMessage(constant.MSG_ERROR_3, ['company', '1', '50']))
    .trim(),
    body('country')
    .exists()
    .isAlpha().withMessage(common.parseMessage(constant.MSG_ERROR_2, ['country']))
    .isLength({
        min: 1,
        max: 20
    }).withMessage(common.parseMessage(constant.MSG_ERROR_3, ['country', '1', '20']))
    .trim(),
    body('rate')
    .exists()
    .isInt().withMessage(common.parseMessage(constant.MSG_ERROR_1, ['rate']))
    .isLength({
        min: 1,
        max: 11
    }).withMessage(common.parseMessage(constant.MSG_ERROR_3, ['rate', '1', '11']))
    .trim(),
];

export default brandValidator;