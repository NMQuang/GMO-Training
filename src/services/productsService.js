import Product from '../models/Product';
import ApiResponseError from '../common/ApiResponseError';
import Brand from '../models/Brand';
import common from '../common/common.js';
import message from '../constants/message.js';
import {
    Op
} from '../config/database';
import MessageResponse from '../common/MessageResponse';
import handleUtil from '../util/handleUtil';

var productsService = {};

/**
 * Fetch all products
 * @param {} req
 * @param {} res
 * @return {List} a list of product
 */
productsService.getAllProduct = async (req, res, next) => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'status', 'imageUrl', 'brandId'],
            include: [{
                model: Brand
            }]
        });
        // setting content of message
        const messageResponse = new MessageResponse();
        messageResponse.param = Product.name;
        messageResponse.msg = message.MSG_SUCCESS_1;

        // handle when successful
        handleUtil.success(products, messageResponse, req, res);

    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
    }
};

/**
 * Fetch a product
 * @param {} req
 * @param {} res
 * @return {Product} a product
 */
productsService.getProduct = async (req, res, next) => {
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
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = Product.name;
            messageResponse.msg = message.MSG_SUCCESS_1;

            // handle when successful
            handleUtil.success(products, messageResponse, req, res);
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
 * Search brand by product's name and pagination
 * @param {} req
 * @param {} res
 * @return {List} a list of product
 */
productsService.findAndPaginationProduct = async (req, res, next) => {

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
    // if (req.body.status) {
    //     condition.status = {
    //         [Op.in]: [0, req.body.status]
    //     }
    // }

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
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = Product.name;
            messageResponse.msg = message.MSG_SUCCESS_1;

            // handle when successful
            handleUtil.success(products.rows, messageResponse, req, res);
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
 * Create a product
 * @param {} req
 * @param {} res
 * @return {Product} a new product
 */
productsService.createProduct = async (req, res, next) => {
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
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = Product.name;
            messageResponse.msg = message.MSG_SUCCESS_2;

            // handle when successful
            handleUtil.success(newProduct, messageResponse, req, res);
        }
    } catch (error) {
        // handle error system
        handleUtil.exceptionSystem(error, next);
    }
};

/**
 * Update a product
 * @param {} req
 * @param {} res
 * @return {Product} a updated product
 */
productsService.editProduct = async (req, res, next) => {
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
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = Product.name;
            messageResponse.msg = message.MSG_SUCCESS_3;

            // handle when successful
            handleUtil.success(product, messageResponse, req, res);
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
 * Delete a product
 * @param {} req
 * @param {} res
 * @return {int} a number deleted record
 */
productsService.deleteProduct = async (req, res, next) => {
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
            // setting content of message
            const messageResponse = new MessageResponse();
            messageResponse.param = Product.name;
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

export default productsService;