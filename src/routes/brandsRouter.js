import express from 'express';
import brandsService from '../services/brandsService';
import brandValidator from '../validator/brandValidator';
import common from '../common/common';

const brandsRouter = express.Router();

// Fetch all brands
brandsRouter.get('/', brandsService.getAllBrand);

// Fetch a brand
brandsRouter.get('/:id', brandsService.getBrand);

// Search brand
brandsRouter.post('/list', brandsService.findBrand);

// Create a brand
brandsRouter.post('/', brandValidator.checkValueBrand, common.checkValidation, brandsService.createBrand);

// Update a brand
brandsRouter.put('/:id', brandValidator.checkValueBrand, common.checkValidation, brandsService.editBrand);

// Delete a brand
brandsRouter.delete('/:id', brandsService.deleteBrand);

export default brandsRouter;