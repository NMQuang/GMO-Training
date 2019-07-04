import Product from '../models/Product';
import ApiResponseSuccess from '../common/ApiResponseSuccess';
import ApiResponseError from '../common/ApiResponseError';
import Brand from '../models/Brand';
import common from '../common/common.js';
import constant from '../constants/message.js';
import {
    Op
} from '../config/database';

var productsService = {};

/**
 * Fetch all products
 * @param {} req
 * @param {} res
 * @return {List} a list of product
 */
productsService.getAllProduct = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'status', 'imageUrl', 'brandId'],
            include: [{
                model: Brand
            }]
        });
        let apiProduct = new ApiResponseSuccess();
        apiProduct.data = products;
        apiProduct.message = common.parseMessage(constant.MSG_SUCCESS_0, ['product']);
        return res.json({
            apiProduct
        });
    } catch (error) {
        let apiProduct = new ApiResponseError();
        apiProduct.data = {};
        apiProduct.message = error;
        return res.json({
            apiProduct
        });
    }
};

/**
 * Fetch a product
 * @param {} req
 * @param {} res
 * @return {Product} a product
 */
productsService.getProduct = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        let products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'status', 'imageUrl', 'brandId'],
            where: {
                id
            },
            include: [{
                model: Brand,
                as: 'brand',
                required: false
            }]
        });

        if (products.length > 0) {
            let apiProduct = new ApiResponseSuccess();
            apiProduct.data = products;
            apiProduct.message = common.parseMessage(constant.MSG_SUCCESS_1, ['product']);
            return res.json({
                apiProduct
            });
        } else {
            let apiProduct = new ApiResponseError();
            apiProduct.data = {};
            apiProduct.message = common.parseMessage(constant.MSG_FAILED_0, ['product']);
            return res.json({
                apiProduct
            });
        }
    } catch (error) {
        let apiProduct = new ApiResponseError();
        apiProduct.data = {};
        apiProduct.message = error;
        return res.json({
            apiProduct
        });
    }
};

/**
 * Search brand by product's name and pagination
 * @param {} req
 * @param {} res
 * @return {List} a list of product
 */
productsService.findAndPaginationProduct = async (req, res) => {

    // define condition in SQL
    const condition = {
        [Op.or]: [{
            name: {
                [Op.substring]: req.body.query
            }
        }, {
            imageUrl: {
                [Op.substring]: req.body.query
            }
        }]
    };
    // if (req.body.query) {
    //     condition.name = {
    //         [Op.substring]: req.body.query
    //     }
    // }
    if (req.body.status) {
        condition.status = {
            [Op.in]: [0, req.body.status]
        }
    }

    try {
        let products = await Product.findAndCountAll({
            attributes: ['id', 'name', 'price', 'status', 'imageUrl', 'brandId'],
            where: condition,
            offset: 0,
            limit: 3,
            include: [{
                model: Brand,
                as: 'brand',
                required: true
            }]
        });

        if (products.rows.length > 0) {
            let apiProduct = new ApiResponseSuccess();
            apiProduct.data = products;
            apiProduct.message = common.parseMessage(constant.MSG_SUCCESS_1, ['product']);
            return res.json({
                apiProduct
            });
        } else {
            let apiProduct = new ApiResponseError();
            apiProduct.data = {};
            apiProduct.message = common.parseMessage(constant.MSG_FAILED_0, ['product']);
            return res.json({
                apiProduct
            });
        }
    } catch (error) {
        let apiProduct = new ApiResponseError();
        apiProduct.data = {};
        apiProduct.message = error;
        return res.json({
            apiProduct
        });
    }
};

/**
 * Create a product
 * @param {} req
 * @param {} res
 * @return {Product} a new product
 */
productsService.createProduct = async (req, res) => {
    const {
        name,
        price,
        status,
        image,
        brandId
    } = req.body;
    try {
        let newProduct = await Product.create({
            name,
            price,
            status,
            image,
            brandId
        }, {
            fields: ['name', 'price', 'status', 'imageUrl', 'brandId']
        });

        if (newProduct) {
            let apiProduct = new ApiResponseSuccess();
            apiProduct.data = newProduct;
            apiProduct.message = common.parseMessage(constant.MSG_SUCCESS_2, ['product']);
            return res.json({
                apiProduct
            });
        }
    } catch (error) {
        let apiProduct = new ApiResponseError();
        apiProduct.data = {};
        apiProduct.message = error;
        return res.json({
            apiProduct
        });
    }
};

/**
 * Update a product
 * @param {} req
 * @param {} res
 * @return {Product} a updated product
 */
productsService.editProduct = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        name,
        price,
        status,
        image,
        brandId
    } = req.body;
    try {
        let product = await Product.findAll({
            where: {
                id
            }
        });

        if (product.length > 0) {
            await Product.update({
                name: name ? name : Product.name,
                price: price ? price : Product.price,
                status: status ? status : Product.status,
                image: image ? image : Product.image,
                brandId: brandId ? brandId : Product.brandId
            }, {
                where: {
                    id
                }
            });
            let apiProduct = new ApiResponseSuccess();
            apiProduct.data = product;
            apiProduct.message = common.parseMessage(constant.MSG_SUCCESS_3, ['product']);
            return res.json({
                apiProduct
            });
        } else {
            let apiProduct = new ApiResponseError();
            apiProduct.data = {};
            apiProduct.message = common.parseMessage(constant.MSG_FAILED_1, ['product']);
            return res.json({
                apiProduct
            });
        }
    } catch (error) {
        let apiProduct = new ApiResponseError();
        apiProduct.data = {};
        apiProduct.message = error;
        return res.json({
            apiProduct
        });
    }
};

/**
 * Delete a product
 * @param {} req
 * @param {} res
 * @return {int} a number deleted record
 */
productsService.deleteProduct = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        let countDeletedRecord = await Product.destroy({
            where: {
                id
            }
        });

        if (countDeletedRecord > 0) {
            let apiProduct = new ApiResponseSuccess();
            apiProduct.data = countDeletedRecord;
            apiProduct.message = common.parseMessage(constant.MSG_SUCCESS_4, ['product']);
            return res.json({
                apiProduct
            });
        } else {
            let apiProduct = new ApiResponseError();
            apiProduct.data = 0;
            apiProduct.message = common.parseMessage(constant.MSG_FAILED_2, ['product']);
            res.json({
                apiProduct
            });
        }
    } catch (error) {
        let apiProduct = new ApiResponseError();
        apiProduct.data = 0;
        apiProduct.message = error;
        return res.json({
            apiProduct
        });
    }
};

export default productsService;