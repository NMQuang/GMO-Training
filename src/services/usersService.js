import bcrypt from 'bcrypt';
import ApiResponseSuccess from './../common/ApiResponseSuccess';
import ApiResponseError from './../common/ApiResponseError';
import {
    User
} from './../models/User';
import constant from '../constants/message';
import common from '../common/common';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';

var tokenList = {};
var usersService = {};

/** Register a user */
usersService.register = async (req, res) => {
    const {
        email,
        password,
        name,
        role
    } = req.body;
    const saltRounds = 12;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = await bcrypt.hashSync(password, salt);
    try {
        let newUser = await User.create({
            email,
            password: hashPassword,
            name,
            role
        }, {
            fields: ['email', 'password', 'name', 'role']
        });
        if (newUser) {
            let apiUser = new ApiResponseSuccess();
            apiUser.data = newUser;
            apiUser.message = common.parseMessage(constant.MSG_SUCCESS_2, ['user']);
            return res.json({
                apiUser
            });
        }
    } catch (error) {
        let apiUser = new ApiResponseError();
        apiUser.data = {};
        apiUser.message = error;
        return res.json({
            apiUser
        });
    }
};

/** Login */
usersService.login = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        // check info of user when login
        let user = await User.findAll({
            attributes: ['id', 'email', 'password', 'name', 'role'],
            where: {
                email
            }
        });
        if (user.length > 0) {
            let validPassword = await bcrypt.compareSync(password, user[0].dataValues.password);
            // create access token for user when login successfully
            if (validPassword) {
                const payload = {
                    user
                }
                // create access token
                const accessToken = await jwt.sign(payload, authConfig.secretToken, {
                    expiresIn: authConfig.expiresToken
                });
                // create refresh token to update access token
                const refreshToken = await jwt.sign(payload, authConfig.secretRefreshToken, {
                    expiresIn: authConfig.expiresRefreshToken
                })
                // save refresh token and information of user
                tokenList[refreshToken] = user;
                let apiUser = new ApiResponseSuccess();
                apiUser.data = user;
                apiUser.message = common.parseMessage(constant.MSG_SUCCESS_1, ['user']);
                return res.json({
                    ...apiUser,
                    'accessToken': accessToken,
                    'refreshToken': refreshToken
                });
            } else {
                let apiUser = new ApiResponseError();
                apiUser.data = {};
                apiUser.message = common.parseMessage(constant.MSG_FAILED_3, ['user']);
                return res.json({
                    apiUser
                });
            }
        } else {
            let apiUser = new ApiResponseError();
            apiUser.data = {};
            apiUser.message = common.parseMessage(constant.MSG_FAILED_3, ['user']);
            return res.json({
                apiUser
            });
        }
    } catch (error) {
        let apiUser = new ApiResponseError();
        apiUser.data = {};
        apiUser.message = error;
        return res.json({
            apiUser
        });
    }
};

/** resign a new access token by refresh token */
usersService.refreshToken = async (req, res) => {
    const {
        refreshToken
    } = req.body;
    console.log(tokenList);
    // check refresh token: exist in request
    if (refreshToken && refreshToken in tokenList) {
        try {
            // verify refresh token
            await jwt.verify(refreshToken, authConfig.secretRefreshToken);
            // get user from refresh token
            const user = tokenList[refreshToken];
            const payload = {
                user
            }
            //create a new access token for this user
            const accessToken = await jwt.sign(payload, authConfig.secretToken, {
                expiresIn: authConfig.expiresToken
            });
            let apiUser = new ApiResponseSuccess();
            apiUser.data = user;
            apiUser.message = common.parseMessage(constant.MSG_SUCCESS_1, ['token']);
            return res.json({
                ...apiUser,
                'accessToken': accessToken,
            });
        } catch (error) {
            let apiAuth = new ApiResponseError();
            apiAuth.data = {};
            apiAuth.message = {
                'name': error.name,
                'msg': error.message
            };
            return res.json({
                ...apiAuth,
                'auth': false
            });
        }
    } else {
        let apiAuth = new ApiResponseError();
        apiAuth.data = {};
        apiAuth.message = common.parseMessage(constant.MSG_AUTH_3, ['refresh token']);
        return res.status(404).json({
            ...apiAuth,
            'auth': false
        });
    }
}

/**
 * Get info a user
 */
usersService.getUser = async (req, res) => {
    const {
        accessToken,
        user
    } = req;
    let apiUser = new ApiResponseSuccess();
    apiUser.data = {
        user,
        accessToken
    };
    apiUser.message = common.parseMessage(constant.MSG_SUCCESS_1, ['user']);
    return res.status(200).json({
        apiUser
    });

};
export default usersService;