import express from 'express';
import usersService from '../services/usersService';
import usersValidator from '../validator/usersValidator';

const usersRouter = express.Router();

// Register a new user
usersRouter.post('/register', usersService.register);

// Login
usersRouter.post('/login', usersValidator.validate, usersService.login);

// Fetch a user
usersRouter.get('/', usersService.getUser);

// Recreate a access token by refresh token
usersRouter.post('/refresh', usersService.refreshToken);

export default usersRouter;