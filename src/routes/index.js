import express from 'express';
import brandsRouter from './brandsRouter';
import productsRouter from './productsRouter';
import usersRouter from './usersRouter';
/**
 * router common:
 * define all router of all request
 */
const router = express.Router();

// router of brand
router.use('/brands', brandsRouter);

// router of product
router.use('/products', productsRouter);

// router of user
router.use('/users', usersRouter);

export default router;