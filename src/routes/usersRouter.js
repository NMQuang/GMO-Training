import express from 'express';
import usersService from '../services/usersService';
import userValidator from './../validator/userValidator';
import common from '../common/common';
import tokenValidator from '../validator/tokenValidator';

const usersRouter = express.Router();

// Register a new user
usersRouter.post('/register', usersService.register);

// Login
usersRouter.post('/login', userValidator.checkValueUser, common.checkValidation, usersService.login);

// Fetch a user
usersRouter.get('/', tokenValidator.authorization, usersService.getUser);

// Recreate a access token by refresh token
usersRouter.post('/refresh', usersService.refreshToken);

export default usersRouter;