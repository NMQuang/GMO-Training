import express from 'express';
var router = express.Router();
import brandsRouter from './brandsRouter';
import productsRouter from './productsRouter';
import usersRouter from './usersRouter';

router.use('/brands', brandsRouter);
router.use('/products', productsRouter);
router.use('/users', usersRouter);

export default router;