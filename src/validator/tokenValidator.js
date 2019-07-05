import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';
import common from '../common/common';
import constant from '../constants/message';
import ApiResponseError from './../common/ApiResponseError';
import security from '../auth/security';

var tokenValidator = {}

/** authorization */
tokenValidator.authorization = async (req, res, next) => {
    var urlOri = req.originalUrl;
    var url = urlOri;
    console.log(/\d/.test(urlOri));
    if (/\d/.test(urlOri)) {
        url = urlOri.substring(0, urlOri.lastIndexOf('/'));
    }
    if (security.authenticationUrl.includes(url)) {
        const accessToken = req.headers['x-access-token'] || req.headers['authorization'];

        try {
            if (!accessToken) {
                let apiAuth = new ApiResponseError();
                apiAuth.data = {};
                apiAuth.message = common.parseMessage(constant.MSG_AUTH_1, ['token']);
                return res.status(401).json({
                    ...apiAuth,
                    'auth': false
                });
                next();
            }
            // verify access token
            const decoded = await jwt.verify(accessToken, authConfig.secretToken);
            // check access token expired or not
            if (decoded.exp * 1000 <= Date.now()) {
                let apiAuth = new ApiResponseError();
                apiAuth.data = {};
                apiAuth.message = common.parseMessage(constant.MSG_AUTH_4, ['token']);
                return res.status(401).json({
                    ...apiAuth,
                    'auth': false
                });
            }
            req.accessToken = accessToken;
            req.user = decoded.user;
            next();
        } catch (error) {
            let apiAuth = new ApiResponseError();
            apiAuth.data = {};
            apiAuth.message = {
                'name': error.name,
                'msg': error.message
            };
            return res.status(401).json({
                ...apiAuth,
                'auth': false
            });
        }
    } else {
        next();
    }
};

export default tokenValidator;