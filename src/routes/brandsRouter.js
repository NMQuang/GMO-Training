import express from 'express';
import brandsService from '../services/brandsService';
import brandsValidator from '../validator/brandsValidator';
import handleUtil from '../util/handleUtil';

const brandsRouter = express.Router();

// Fetch all brands
brandsRouter.get('/', brandsService.getAllBrand);

// Fetch a brand
brandsRouter.get('/:id', brandsService.getBrandQuery);

// Search brand
brandsRouter.post('/list', brandsService.findBrand);

// Create a brand
brandsRouter.post('/', brandsValidator.validate, brandsService.createBrand);

// Update a brand
brandsRouter.put('/:id', brandsValidator.validate, brandsService.editBrand);

// Delete a brand
brandsRouter.delete('/:id', brandsService.deleteBrand);

export default brandsRouter;