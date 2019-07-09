import Product from '../models/Product';
import Brand from '../models/Brand';
import message from '../constants/message.js';
import {
    Op
} from '../config/database';
import MessageResponse from '../common/MessageResponse';
import handleUtil from '../util/handleUtil';
import productsSQL from '../sql/productsSql';
import common from '../common/common';

var productsService = {};

/**
 * Fetch all products
 * @param {} req
 * @param {} res
 * @return {List} a list of product
 */
productsService.getAllProduct = async (req, res, next) => {

    // setting content of message
    const messageResponse = new MessageResponse();
    messageResponse.param = Product.name;
    messageResponse.msg = message.MSG_SUCCESS_1;

    // handle process data
    common.processData(messageResponse, req, res, next, () => {
        return Product.findAll({
            attributes: ['id', 'name', 'price', 'status', 'imageUrl', 'brandId'],
            include: [{
                model: Brand
            }]
        });
    });
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

    // setting content of message
    const messageResponse = new MessageResponse();
    messageResponse.param = Product.name;
    messageResponse.msg = message.MSG_SUCCESS_1;

    // handle process data
    common.processData(messageResponse, req, res, next, () => {
        return Product.findAll({
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
    });
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

    // setting content of message
    const messageResponse = new MessageResponse();
    messageResponse.param = Product.name;
    messageResponse.msg = message.MSG_SUCCESS_1;

    // handle process data
    common.processData(messageResponse, req, res, next, () => {
        return Product.findAndCountAll({
            attributes: ['id', 'name', 'price', 'status', 'imageUrl', 'brandId'],
            where: condition,
            offset: 0,
            limit: 3,
            include: [{
                model: Brand,
                as: 'brand',
                required: true
            }]
        }).rows;
    });
};

/**
 * Search brand by product's name and pagination by query
 * @param {} req
 * @param {} res
 * @return {List} a list of product
 */
productsService.findAndPaginationProductByQuery = async (req, res, next) => {

    const {
        query,
        offset,
        limit
    } = req.body;

    // setting content of message
    const messageResponse = new MessageResponse();
    messageResponse.param = Product.name;
    messageResponse.msg = message.MSG_SUCCESS_1;

    // handle process data
    common.processData(messageResponse, req, res, next, () => {
        return Product.sequelize.query(productsSQL.findAndPaginationProduct, {
            replacements: {
                query: '%' + query + '%',
                offset,
                limit
            },
            type: Product.sequelize.QueryTypes.SELECT
        });
    });
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

    // setting content of message
    const messageResponse = new MessageResponse();
    messageResponse.param = Product.name;
    messageResponse.msg = message.MSG_SUCCESS_2;

    // handle process data
    common.processData(messageResponse, req, res, next, () => {
        return Product.create({
            name,
            price,
            status,
            image,
            brandId
        }, {
            fields: ['name', 'price', 'status', 'imageUrl', 'brandId']
        });
    });
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

    let product = await Product.findAll({
        where: {
            id
        }
    });
    // setting content of message
    const messageResponse = new MessageResponse();
    messageResponse.param = Product.name;
    messageResponse.msg = message.MSG_SUCCESS_3;

    // handle process data
    common.processData(messageResponse, req, res, next, () => {
        return Product.update({
            name: name ? name : product.name,
            price: price ? price : product.price,
            status: status ? status : product.status,
            image: image ? image : product.image,
            brandId: brandId ? brandId : product.brandId
        }, {
            where: {
                id
            }
        });
    });
}

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

    // setting content of message
    const messageResponse = new MessageResponse();
    messageResponse.param = Product.name;
    messageResponse.msg = message.MSG_SUCCESS_4;

    // handle process data
    common.processData(messageResponse, req, res, next, () => {
        return Product.destroy({
            where: {
                id
            }
        });
    });

};

export default productsService;