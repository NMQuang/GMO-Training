import {
    User
} from './../models/User';
import message from '../constants/message';
import authConfig from '../config/auth';
import MessageResponse from '../common/MessageResponse';
import handleUtil from '../util/handleUtil';
import jwtUtil from '../util/jwtUtil';

var tokenList = {};
var usersService = {};

/**
 * Register a product
 * @param {} req
 * @param {} res
 * @return {User} a user
 */
usersService.register = async (req, res, next) => {
    const {
        email,
        password,
        name,
        role
    } = req.body;

    // hash password
    const saltRounds = 12;
    const hashPassword = await jwtUtil.hashJwt(password, saltRounds);

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
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = User.name;
            messageResponse.msg = message.MSG_SUCCESS_2;

            // handle when successful
            handleUtil.success(newUser, messageResponse, req, res);
        }
    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
    }
};

/**
 * Login
 * @param {} req
 * @param {} res
 * @return {user}
 */
usersService.login = async (req, res, next) => {
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
            // check password
            let validPassword = await jwtUtil.comparePassword(password, user[0].dataValues.password);

            // create access token for user when login successfully
            if (validPassword) {
                const payload = {
                    user
                }

                // create access token
                const accessToken = await jwtUtil.signToken(payload, authConfig.secretToken, {
                    expiresIn: authConfig.expiresToken
                });
                // create refresh token to update access token
                const refreshToken = await jwtUtil.signToken(payload, authConfig.secretRefreshToken, {
                    expiresIn: authConfig.expiresRefreshToken
                })
                // save refresh token and information of user
                tokenList[refreshToken] = user;

                // setting content of message
                const messageResponse = new MessageResponse();
                messageResponse.param = User.name;
                messageResponse.msg = message.MSG_SUCCESS_2;

                // resetting propeties of model: User
                user[0].dataValues.accessToken = accessToken;
                user[0].dataValues.refreshToken = refreshToken;

                // handle when successful
                handleUtil.success(user[0].dataValues, messageResponse, req, res);
            } else {
                // handle error when data not found
                handleUtil.exceptionNotFound(next);
            }
        } else {
            // handle error when data not found
            handleUtil.exceptionNotFound(next);
        }
    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
    }
};

/**
 * resign a new access token by refresh token
 * @param {} req
 * @param {} res
 * @return {User} a user with new access token
 */
usersService.refreshToken = async (req, res, next) => {
    const {
        refreshToken
    } = req.body;
    // check refresh token: exist in request
    if (refreshToken && refreshToken in tokenList) {
        try {
            // verify refresh token
            await jwtUtil.verifyToken(refreshToken, authConfig.secretRefreshToken);
            // get user from refresh token
            const user = tokenList[refreshToken];
            const payload = {
                user
            }
            //create a new access token for this user
            const accessToken = await jwtUtil.signToken(payload, authConfig.secretToken, {
                expiresIn: authConfig.expiresToken
            });
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = User.name;
            messageResponse.msg = message.MSG_SUCCESS_1;

            // resetting propeties of model: User
            user[0].dataValues.accessToken = accessToken;

            // handle when successful
            handleUtil.success(user, messageResponse, req, res);

        } catch (error) {

            // handle error system
            handleUtil.exceptionSystem(error, next);
        }
    } else {
        // handle error authentication
        let messageResponse = new MessageResponse(['refresh token'], message.MSG_AUTH_3);
        handleUtil.exceptionAuthentication(messageResponse, next);
    }
}

/**
 * Fetch a user
 * @param {} req
 * @param {} res
 * @return {User} a user
 */
usersService.getUser = async (req, res, next) => {
    let {
        accessToken,
        user
    } = req;

    user = [{
        ...user,
        accessToken
    }];
    // setting content of message
    const messageResponse = new MessageResponse();
    messageResponse.param = User.name;
    messageResponse.msg = message.MSG_SUCCESS_1;

    // handle when successful
    handleUtil.success(user, messageResponse, req, res);

};

export default usersService;