import express from 'express';
import Product from '../../models/Product.js';
import {
    BadRequestError,
    ConflictError,
    InternalServerError,
    NotFoundError,
    UnprocessableEntityError
} from '../../utils/errors.js';
import {APIResponse} from "../../utils/responses.js";
import {setValue} from "../../utils/setValue.js";
import mapValidationErrors from "../../utils/mapValidationErrors.js";

/**
 * Product controller
 * @type {Router}
 */
const products = express.Router();

// Global controller values
const currentVersion = process.env.API_VERSION;
const skuRegex = /\/(?<sku>[A-Z]{2}-\d{4}-\d{2})/;
const docsUrl = `/docs/api/${currentVersion}/products`;

/**
 * @route   GET /products
 * @desc    Get all products
 * @access  Public
 */
products.get('/', async (req, res, next) => {
    const products = await Product.find({});

    new APIResponse(req)
        .withDocsUrl(docsUrl)
        .send(products);
});

/**
 * @route   GET /products/:sku
 * @desc    Get a product by SKU
 * @access  Public
 */
products.get(skuRegex, async (req, res, next) => {
    const {sku} = req.params;
    const product = await Product.findOne({sku});

    const endpointDocsUrl = `${docsUrl}#retrieve-a-product`;

    if (!product) {
        throw new NotFoundError(`Product with SKU ${sku} not found.`)
            .withCode('RESOURCE_NOT_FOUND')
            .withDetails('Please check the SKU and try again.')
            .withDocsUrl(endpointDocsUrl);
    }

    new APIResponse(req)
        .withCode('RESOURCE_RETRIEVED')
        .withDocsUrl(endpointDocsUrl)
        .send(product);
});

/**
 * @route   POST /products
 * @desc    Add a new product
 * @access  Public
 */
products.post('/', async (req, res, next) => {

    const {sku, name, price, stockOnHand} = setValue(req.body, {});
    const endpointDocsUrl = `${docsUrl}#add-a-new-product`;
    const product = new Product({sku, name, price, stockOnHand});
    const validation = product.validateSync();

    if (validation) {
        throw new UnprocessableEntityError(validation._message)
            .withCode('VALIDATION_ERROR')
            .withDetails(mapValidationErrors(validation.errors))
            .withDocsUrl(endpointDocsUrl);
    }

    await product.save()
        .then(product => {
            return new APIResponse(req)
                .withStatusCode(201)
                .withCode('RESOURCE_CREATED')
                .withDocsUrl(endpointDocsUrl)
                .withLocation(`${req.baseUrl}/${product.sku}`)
                .send({
                    message: 'The product has been successfully created.',
                    product: product
                });
        })
        .catch(error => {
            if (error.code === 11000) {
                throw new ConflictError('Product with SKU already exists.')
                    .withCode('RESOURCE_ALREADY_EXISTS')
                    .withDocsUrl(endpointDocsUrl)
                    .withDetails('Please change the SKU and try again.');
            } else {
                throw new InternalServerError('Product could not be saved.')
                    .withCode('RESOURCE_NOT_CREATED')
                    .withDetails('Please try again.')
                    .withDocsUrl(endpointDocsUrl);
            }
        })
        .catch(next);
});

/**
 * @route   PUT /products/:sku
 * @desc    Replace a product by SKU
 * @access  Public
 */
products.put(skuRegex, async (req, res, next) => {
    const {sku} = req.params;
    const {name, price, stockOnHand} = setValue(req.body, {});
    const routeDocsUrl = `${docsUrl}#replace-a-product`;

    await Product.findOneAndReplace(
        {sku},
        {sku, name, price, stockOnHand},
        {
            new: true,
            strict: true,
            upsert: false,
            runValidators: true,
            includeResultMetadata: true,
        }
    ).exec()
        .then((result) => {
            if (result.lastErrorObject.updatedExisting === false) {
                throw new NotFoundError(`Product with SKU ${sku} not found.`)
                    .withCode('PRODUCT_NOT_FOUND')
                    .withDetails('Please check the SKU and try again.')
                    .withDocsUrl(routeDocsUrl);
            } else if (result.value === null) {
                throw new InternalServerError('Product could not be replaced.')
                    .withCode('RESOURCE_NOT_REPLACED')
                    .withDetails('Please try again.')
                    .withDocsUrl(routeDocsUrl)
            } else {
                return new APIResponse(req)
                    .withStatusCode(200)
                    .withCode('RESOURCE_REPLACED')
                    .withDocsUrl(routeDocsUrl)
                    .send({
                        message: 'The product has been successfully replaced.',
                        product: result.value
                    });
            }
        })
        .catch(function (err) {
            if (err.name === 'ValidationError') {
                throw new UnprocessableEntityError(setValue(
                            err._message,
                            'Product could not be replaced, due to validation errors.'
                        ))
                    .withCode('VALIDATION_ERROR')
                    .withDetails(mapValidationErrors(err.errors))
                    .withDocsUrl(routeDocsUrl);
            }
            return next(err);
        }).catch(next);
});

/**
 * @route   PATCH /products/:sku
 * @desc    Update a product by SKU
 * @access  Public
 */
products.patch(skuRegex, async (req, res, next) => {
    const {sku} = req.params;
    const updateFields = {...req.body} || {};
    const endpointDocsUrl = `${docsUrl}#update-a-product`;

    if (Object.keys(updateFields).length === 0) {
        throw new UnprocessableEntityError('No fields provided for update.')
            .withCode('UPDATE_FIELDS_REQUIRED')
            .withDetails('Please provide fields to update.')
            .withDocsUrl(endpointDocsUrl);
    }

    if (updateFields.sku && updateFields.sku !== sku) {
        throw new BadRequestError('SKU cannot be updated.')
            .withCode('UPDATE_NOT_ALLOWED')
            .withDetails('Please remove the SKU field and try again.')
            .withDocsUrl(endpointDocsUrl);
    }
    delete updateFields.sku;

    await Product.findOneAndUpdate({sku}, updateFields, {
        new: true,
        strict: true,
        upsert: false,
        runValidators: true,
        includeResultMetadata: true,
    }).exec()
        .then((result) => {
            console.log(result);
            if (result.lastErrorObject.updatedExisting === false) {
                throw new NotFoundError(`Product with SKU ${sku} not found.`)
                    .withCode('PRODUCT_NOT_FOUND')
                    .withDetails('Please check the SKU and try again.')
                    .withDocsUrl(endpointDocsUrl);
            } else if (result.value === null) {
                throw new InternalServerError('Product could not be updated.')
                    .withCode('RESOURCE_NOT_UPDATED')
                    .withDetails('Please try again.')
                    .withDocsUrl(endpointDocsUrl)
            } else {
                return new APIResponse(req)
                    .withStatusCode(200)
                    .withCode('RESOURCE_UPDATED')
                    .withDocsUrl(endpointDocsUrl)
                    .send({
                        message: 'The product has been successfully updated.',
                        product: result.value
                    });
            }
        })
        .catch(function (err) {
            if (err.name === 'ValidationError') {
                throw new UnprocessableEntityError(setValue(
                            err._message,
                            'Product could not be updated, due to validation errors.'
                        ))
                    .withCode('VALIDATION_ERROR')
                    .withDetails(mapValidationErrors(err.errors))
                    .withDocsUrl(endpointDocsUrl);
            }
            return next(err);
        })
        .catch(next);
});

/**
 * @route   DELETE /products/:sku
 * @desc    Remove a product by SKU
 * @access  Public
 */
products.delete(skuRegex, async (req, res, next) => {
    const {sku} = req.params;
    const endpointDocsUrl = `${docsUrl}#remove-a-product`;

    await Product.findOneAndDelete({sku}, {includeResultMetadata: true})
        .exec()
        .then((result, ) => {
            console.log(result);
            if (result.lastErrorObject.n === 0 && result.ok === 1 && result.value === null) {
                throw new NotFoundError(`Product with SKU ${sku} not found.`)
                    .withCode('RESOURCE_NOT_FOUND')
                    .withDetails('Please check the SKU and try again.')
                    .withDocsUrl(endpointDocsUrl);
            } else if (result.ok === 1 && result.value !== null) {
                return new APIResponse(req)
                    .withStatusCode(200)
                    .withCode('RESOURCE_DELETED')
                    .withDocsUrl(endpointDocsUrl)
                    .send({
                        message: 'The product has been successfully deleted.',
                        product: result.value
                    });
            } else {
                throw new InternalServerError('Product could not be deleted.')
                    .withCode('RESOURCE_NOT_DELETED')
                    .withDetails('Please try again.')
                    .withDocsUrl(endpointDocsUrl);
            }
        })
        .catch(next);
});

export default products;