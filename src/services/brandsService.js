import Brand from '../models/Brand';
import Product from '../models/Product';
import ApiResponseSuccess from '../common/ApiResponseSuccess';
import ApiResponseError from '../common/ApiResponseError';
import common from '../common/common.js';
import constant from '../constants/message.js';
import {
    Op
} from '../config/database';

var brandsService = {};

/**
 * Fetch all brands
 * @param {} req
 * @param {} res
 * @return {List} a list of brand
 */
brandsService.getAllBrand = async (req, res) => {
    try {
        const brands = await Brand.findAll({
            attributes: ['id', 'name', 'company', 'country', 'rate'],
        });
        let apiBrand = new ApiResponseSuccess();
        apiBrand.data = brands;
        apiBrand.message = common.parseMessage(constant.MSG_SUCCESS_0, ['brand']);
        return res.json({
            apiBrand
        });
    } catch (error) {
        let apiBrand = new ApiResponseError();
        apiBrand.data = {};
        apiBrand.message = error;
        return res.json({
            apiBrand
        });
    }
};

/**
 * Fetch a brand
 * @param {} req
 * @param {} res
 * @return {Brand} a brand
 */
brandsService.getBrand = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        let brands = await Brand.findAll({
            attributes: ['id', 'name', 'company', 'country', 'rate'],
            where: {
                id
            },
            include: [{
                model: Product,
                as: 'products',
                required: false
            }]
        });

        if (brands.length > 0) {
            let apiBrand = new ApiResponseSuccess();
            apiBrand.data = brands;
            apiBrand.message = common.parseMessage(constant.MSG_SUCCESS_1, ['brand']);
            return res.json({
                apiBrand
            });
        } else {
            let apiBrand = new ApiResponseError();
            apiBrand.data = {};
            apiBrand.message = common.parseMessage(constant.MSG_FAILED_0, ['brand']);
            return res.json({
                apiBrand
            });
        }
    } catch (error) {
        let apiBrand = new ApiResponseError();
        apiBrand.data = {};
        apiBrand.message = error;
        return res.json({
            apiBrand
        });
    }
};

/**
 * Search brand by brand's name or brand's company
 * @param {} req
 * @param {} res
 * @return {List} a list of brand
 */
brandsService.findBrand = async (req, res) => {
    const {
        query
    } = req.body;
    try {
        let brands = await Brand.findAll({
            attributes: ['id', 'name', 'company', 'country', 'rate'],
            where: {
                [Op.or]: [{
                        name: {
                            [Op.substring]: query
                        }
                    },
                    {
                        company: {
                            [Op.substring]: query
                        }
                    }
                ]
            },
            include: [{
                model: Product,
                as: 'products',
                required: false
            }]
        });

        if (brands.length > 0) {
            let apiBrand = new ApiResponseSuccess();
            apiBrand.data = brands;
            apiBrand.message = common.parseMessage(constant.MSG_SUCCESS_1, ['brand']);
            return res.json({
                apiBrand
            });
        } else {
            let apiBrand = new ApiResponseError();
            apiBrand.data = {};
            apiBrand.message = common.parseMessage(constant.MSG_FAILED_0, ['brand']);
            return res.json({
                apiBrand
            });
        }
    } catch (error) {
        let apiBrand = new ApiResponseError();
        apiBrand.data = {};
        apiBrand.message = error;
        return res.json({
            apiBrand
        });
    }
};

/**
 * Create a brand
 * @param {} req
 * @param {} res
 * @return {Brand} a new brand
 */
brandsService.createBrand = async (req, res) => {
    const {
        name,
        company,
        country,
        rate
    } = req.body;
    try {
        let newBrand = await Brand.create({
            name,
            company,
            country,
            rate
        }, {
            fields: ['name', 'company', 'country', 'rate']
        });

        if (newBrand) {
            let apiBrand = new ApiResponseSuccess();
            apiBrand.data = newBrand;
            apiBrand.message = common.parseMessage(constant.MSG_SUCCESS_2, ['brand']);
            return res.json({
                apiBrand
            });
        }
    } catch (error) {
        let apiBrand = new ApiResponseError();
        apiBrand.data = {};
        apiBrand.message = error;
        return res.json({
            apiBrand
        });
    }
};

/**
 * Update a brand
 * @param {} req
 * @param {} res
 * @return {Brand} a updated brand
 */
brandsService.editBrand = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        name,
        company,
        country,
        rate
    } = req.body;
    try {
        let brand = await Brand.findAll({
            where: {
                id
            }
        });

        if (brand.length > 0) {
            await Brand.update({
                name: name ? name : brand.name,
                company: company ? company : brand.company,
                country: country ? country : brand.country,
                rate: rate ? rate : brand.rate
            }, {
                where: {
                    id
                }
            });
            let apiBrand = new ApiResponseSuccess();
            apiBrand.data = brand;
            apiBrand.message = common.parseMessage(constant.MSG_SUCCESS_3, ['brand']);
            return res.json({
                apiBrand
            });
        } else {
            let apiBrand = new ApiResponseError();
            apiBrand.data = {};
            apiBrand.message = common.parseMessage(constant.MSG_FAILED_1, ['brand']);
            return res.json({
                apiBrand
            });
        }
    } catch (error) {
        let apiBrand = new ApiResponseError();
        apiBrand.data = {};
        apiBrand.message = error;
        return res.json({
            apiBrand
        });
    }
};

/**
 * Delete a brand
 * @param {} req
 * @param {} res
 * @return {int} a number deleted record
 */
brandsService.deleteBrand = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        await Product.destroy({
            where: {
                brandId: id
            }
        });
        let countDeletedRecord = await Brand.destroy({
            where: {
                id
            }
        });
        if (countDeletedRecord > 0) {
            let apiBrand = new ApiResponseSuccess();
            apiBrand.data = countDeletedRecord;
            apiBrand.message = common.parseMessage(constant.MSG_SUCCESS_4, ['brand']);
            return res.json({
                apiBrand
            });
        } else {
            let apiBrand = new ApiResponseError();
            apiBrand.data = 0;
            apiBrand.message = common.parseMessage(constant.MSG_FAILED_2, ['brand']);
            res.json({
                apiBrand
            });
        }
    } catch (error) {
        let apiBrand = new ApiResponseError();
        apiBrand.data = 0;
        apiBrand.message = error;
        return res.json({
            apiBrand
        });
    }
};

export default brandsService;