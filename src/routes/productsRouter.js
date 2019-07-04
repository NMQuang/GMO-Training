import express from 'express';
import productsService from '../services/productsService';
import common from '../common/common';
import productValidator from '../validator/productValidator';

const productsRouter = express.Router();

// Fetch all products
productsRouter.get('/', productsService.getAllProduct);

// Fetch a product
productsRouter.get('/:id', productsService.getProduct);

// Search product
productsRouter.post('/list', productsService.findAndPaginationProduct);

// Create a product
productsRouter.post('/', productValidator.checkValueProduct, common.checkValidation, productsService.createProduct);

// Update a product
productsRouter.put('/:id', productValidator.checkValueProduct, common.checkValidation, productsService.editProduct);

// Delete a product
productsRouter.delete('/:id', productsService.deleteProduct);

export default productsRouter;