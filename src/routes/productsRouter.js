import express from 'express';
const productsRouter = express.Router();
import productsService from '../services/productsService';
import common from '../common/common';
import productValidator from '../validator/productValidator';

// Fetch all Products
// Return a list of Product
productsRouter.get('/', productsService.getAllProduct);

// Fetch a Product
// Return a Products
productsRouter.get('/:id', productsService.getProduct);

// Find product
// Return product
productsRouter.post('/list', productsService.findProduct);

// Create a product
// Return a new product
productsRouter.post('/', productValidator.checkValueProduct, common.checkValidation, productsService.createProduct);

// Update product
// Return a updated product
productsRouter.put('/:id', productValidator.checkValueProduct, common.checkValidation, productsService.editProduct);

// Delete a product
// Return a number deleted product
productsRouter.delete('/:id', productsService.deleteProduct);

export default productsRouter;