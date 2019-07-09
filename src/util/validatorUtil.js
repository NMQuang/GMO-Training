import {
    validationResult
} from 'express-validator';
import handleUtil from './handleUtil';

/**
 * check validate
 */
const validatorUtil = {};

/**
 * check validate
 * @param {} req
 * @param {} res
 * @param {} next
 * @return {} error
 */
validatorUtil.validate = (req, res, next) => {

    const error = validationResult(req);

    /**
     * check validatation have or not
     * if have error: go to handle exception validate
     * if dont have error: go to next()
     */
    if (!error.isEmpty()) {
        handleUtil.exceptionValidate(error, next);
    } else {
        next();
    }
}

export default validatorUtil;