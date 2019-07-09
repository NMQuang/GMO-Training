import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * custom about jwt:
 * hash password
 * compare password
 * sign a token for user
 * verify a token
 */
const jwtUtil = {};

/**
 * hash password
 * @param {String} password
 * @param {int} saltRound
 * @return {String} hash password
 */
jwtUtil.hashJwt = (password, saltRound) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRound, (error, hashPassword) => {
            if (error) {
                return reject(error);
            }
            resolve(hashPassword);
        });
    });
};

/**
 * compare password when user login
 * @param {String} targetPassword
 * @param {String} sourcePassword
 * @return {Boolean} validPassword
 */
jwtUtil.comparePassword = (targetPassword, sourcePassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(targetPassword, sourcePassword, (error, validPassword) => {
            if (error) {
                return reject(error);
            }
            resolve(validPassword);
        });
    });
};

/**
 * sign token for user
 * @param {Object} payload
 * @param {String} secretKey
 * @param {Object} option
 * @return {object} token
 */
jwtUtil.signToken = (payload, secretKey, option) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, option, (error, validPassword) => {
            if (error) {
                return reject(error);
            }
            resolve(validPassword);
        });
    });
};

/**
 * verify a token
 * @param {String} token
 * @param {String} secretKey
 * @return {}
 */
jwtUtil.verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        });
    });
};

export default jwtUtil;