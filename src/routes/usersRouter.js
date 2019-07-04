import express from 'express';
import usersService from '../services/usersService';
const usersRouter = express.Router();
import userValidator from './../validator/userValidator';
import common from '../common/common';
import tokenValidator from '../validator/tokenValidator';

usersRouter.post('/register', usersService.register);

usersRouter.post('/login', userValidator.checkValueUser, common.checkValidation, usersService.login);

usersRouter.get('/', tokenValidator.authorization, usersService.getUser);

usersRouter.post('/refresh', usersService.refreshToken);

export default usersRouter;