import express from 'express';
import productsService from '../services/productsService';
import productsValidator from '../validator/productsValidator';

const productsRouter = express.Router();

// Fetch all products
productsRouter.get('/', productsService.getAllProduct);

// Fetch a product
productsRouter.get('/:id', productsService.getProduct);

// Search product
productsRouter.post('/list', productsService.findAndPaginationProduct);

// Create a product
productsRouter.post('/', productsValidator.validate, productsService.createProduct);

// Update a product
productsRouter.put('/:id', productsValidator.validate, productsService.editProduct);

// Delete a product
productsRouter.delete('/:id', productsService.deleteProduct);

export default productsRouter;