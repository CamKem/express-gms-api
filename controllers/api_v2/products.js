// controllers/api_v1/products.js

import express from 'express';
import Product from '../../models/Product.js';
import {BadRequestError, NotFoundError} from '../../utils/errors.js';

const products = express.Router();

/**
 * @route   GET /products
 * @desc    Get all products
 * @access  Public
 */
products.get('/', async (req, res, next) => {
    const products = await Product.find({});
    res.json({
        statusCode: 200,
        data: products,
    });
});

/**
 * @route   GET /products/:sku
 * @desc    Get a product by SKU
 * @access  Public
 */
const skuPattern = '\\(\\[A-Z\\]{2}-\\d{4}-\\d{2}\\)';
products.get(`/:sku${skuPattern}`, async (req, res, next) => {
    const {sku} = req.params;
    const product = await Product.findOne({sku});
    if (!product) {
        throw new NotFoundError(`Product with SKU ${sku} not found.`);
    }
    res.json({
        statusCode: 200,
        data: product,
    });
});

/**
 * @route   POST /products
 * @desc    Add a new product
 * @access  Public
 */
products.post('/', async (req, res, next) => {

    const {sku, name, price, stockOnHand} = req.body || {};

    // Validate required fields
    if (!sku || !name || price === undefined || stockOnHand === undefined) {
        throw new BadRequestError('Missing required product fields.');
    }

    // Check if a product with the same SKU already exists
    const existingProduct = await Product.findOne({sku});
    if (existingProduct) {
        throw new BadRequestError(`Product with SKU ${sku} already exists.`);
    }

    const product = new Product({sku, name, price, stockOnHand});
    await product.save();

    res.status(201).json({
        statusCode: 201,
        data: product,
    });
});

/**
 * @route   PUT /products/:sku
 * @desc    Replace a product by SKU
 * @access  Public
 */
products.put('/:sku', async (req, res, next) => {
    try {
        const {sku} = req.params;
        const {name, price, stockOnHand} = req.body || {};

        // Validate required fields
        if (!name || price === undefined || stockOnHand === undefined) {
            return next(new BadRequestError('Missing required product fields.'));
        }

        // Ensure SKU is not being updated
        if (req.body.sku && req.body.sku !== sku) {
            return next(new BadRequestError('Cannot update SKU.'));
        }

        const product = await Product.findOneAndUpdate(
            {sku},
            {name, price, stockOnHand},
            {new: true, upsert: false}
        );

        if (!product) {
            return next(new NotFoundError(`Product with SKU ${sku} not found.`));
        }

        res.json({
            statusCode: 200,
            data: product,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

/**
 * @route   PATCH /products/:sku
 * @desc    Update a product by SKU
 * @access  Public
 */
products.patch('/:sku', async (req, res, next) => {
    const {sku} = req.params;
    const updateFields = {...req.body} || {};

    if (Object.keys(updateFields).length === 0) {
        return new BadRequestError('No fields provided for update.');
    }

    // Prevent SKU from being updated
    if (updateFields.sku && updateFields.sku !== sku) {
        return next(new BadRequestError('Cannot update SKU.'));
    }
    delete updateFields.sku; // Remove SKU from updateFields if present

    const product = await Product.findOneAndUpdate({sku}, updateFields, {
        new: true,
    });

    if (!product) {
        return next(new NotFoundError(`Product with SKU ${sku} not found.`));
    }

    res.json({
        statusCode: 200,
        data: product,
    });
});

/**
 * @route   DELETE /products/:sku
 * @desc    Remove a product by SKU
 * @access  Public
 */
products.delete('/:sku', async (req, res, next) => {
    try {
        const {sku} = req.params;
        const product = await Product.findOneAndDelete({sku});

        if (!product) {
            return next(new NotFoundError(`Product with SKU ${sku} not found.`));
        }

        res.status(204).send(); // No Content
    } catch (error) {
        next(error);
    }
});

export default products;