import Brand from '../models/Brand';
import Product from '../models/Product';
import message from '../constants/message.js';
import {
    Op
} from '../config/database';
import handleUtil from '../util/handleUtil';
import MessageResponse from '../common/MessageResponse';

var brandsService = {};

/**
 * Fetch all brands
 * @param {} req
 * @param {} res
 * @return {List} a list of brand
 */
brandsService.getAllBrand = async (req, res, next) => {
    try {
        const brands = await Brand.findAll({
            attributes: ['id', 'name', 'company', 'country', 'rate'],
        });
        // setting content of message
        const messageResponse = new MessageResponse();
        messageResponse.param = Brand.name;
        messageResponse.msg = message.MSG_SUCCESS_1;

        // handle when successful
        handleUtil.success(brands, messageResponse, req, res);
    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
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
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = Brand.name;
            messageResponse.msg = message.MSG_SUCCESS_1;

            // handle when successful
            handleUtil.success(brands, messageResponse, req, res);
        } else {
            // handle error when data not found
            handleUtil.exceptionNotFound(next);
        }
    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
    }
};

/**
 * Fetch a brand
 * @param {} req
 * @param {} res
 * @return {Brand} a brand
 */
brandsService.getBrandQuery = async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        let brands = await Brand.sequelize.query('select * from brands where id = :id', {
            replacements: {
                id
            },
            type: Brand.sequelize.QueryTypes.SELECT
        })

        // check data is found or not
        if (brands.length > 0) {
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = Brand.name;
            messageResponse.msg = message.MSG_SUCCESS_1;

            // handle when successful
            handleUtil.success(brands, messageResponse, req, res);
        } else {
            // handle error when data not found
            handleUtil.exceptionNotFound(next);
        }
    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
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
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = Brand.name;
            messageResponse.msg = message.MSG_SUCCESS_1;

            // handle when successful
            handleUtil.success(brands, messageResponse, req, res);

        } else {
            // handle error when data not found
            handleUtil.exceptionNotFound(next);
        }
    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
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
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = Brand.name;
            messageResponse.msg = message.MSG_SUCCESS_2;

            // handle when successful
            handleUtil.success(newBrand, messageResponse, req, res);
        }
    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
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
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = Brand.name;
            messageResponse.msg = message.MSG_SUCCESS_3;

            // handle when successful
            handleUtil.success(brand, messageResponse, req, res);
        } else {
            // handle error when data not found
            handleUtil.exceptionNotFound(next);
        }
    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
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
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = Brand.name;
            messageResponse.msg = message.MSG_SUCCESS_4;

            // handle when successful
            handleUtil.success(countDeletedRecord, messageResponse, req, res);
        } else {
            // handle error when data not found
            handleUtil.exceptionNotFound(next);
        }
    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
    }
};

export default brandsService;