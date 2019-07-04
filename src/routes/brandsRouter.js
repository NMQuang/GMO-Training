import express from 'express';
const brandsRouter = express.Router();
import brandsService from '../services/brandsService';
import brandValidator from '../validator/brandValidator';
import common from '../common/common';

// Fetch all Brands
// Return a list of Brand
brandsRouter.get('/', brandsService.getAllBrand);

// Fetch a Brands
// Return a Brand
brandsRouter.get('/:id', brandsService.getBrand);

// Search brand
// Return a Brand
brandsRouter.post('/list', brandsService.findBrand);

// Create a brand
// Return a new Brand
brandsRouter.post('/', brandValidator.checkValueBrand, common.checkValidation, brandsService.createBrand);

// Update Brand
// Return a updated Brand
brandsRouter.put('/:id', brandValidator.checkValueBrand, common.checkValidation, brandsService.editBrand);

// Delete a Brand
// Return a number deleted record
brandsRouter.delete('/:id', brandsService.deleteBrand);
export default brandsRouter;