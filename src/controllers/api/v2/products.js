import express from 'express';
import Product from '../../../models/Product.js';
import {
    BadRequestError,
    ConflictError,
    InternalServerError,
    NotFoundError,
    UnprocessableEntityError
} from '../../../utils/errors/errors.js';
import APIResponse from "../../../utils/responses/apiResponses.js";
import {setValue} from "../../../utils/setValue.js";
import mapValidationErrors from "../../../utils/mapValidationErrors.js";
import auth from "../../../middleware/authHandler.js";

/**
 * Product controller
 * @type {Router}
 */
const products = express.Router();

const currentVersion = process.env.API_VERSION;
const skuRegex = /\/(?<sku>[A-Z]{2}-\d{4}-\d{2})/;
const docsUrl = `/docs/api/${currentVersion}/products`;

/**
 * GET /products
 * @summary Retrieve a list of products
 * @tags Products
 * @return {APIResponse} 200 - success response
 * @return {ErrorResponse} 500 - Internal server error
 * @see ./docs/jsdoc/getMany.js
 */
products.get('/', async (req, res, next) => {
    await Product.find({}, {__v: 0, _id: 0})
        .exec()
        .then(products => {
            return new APIResponse(req)
                .withCode('RESOURCE_RETRIEVED')
                .withDocsUrl(`${docsUrl}#retrieve-a-list-of-products`)
                .send({
                    message: 'The products have been successfully retrieved.',
                    products: products
                });
        })
        .catch(err => {
            if (err) {
                throw new InternalServerError('Products could not be retrieved.')
                    .withCode('RESOURCE_NOT_RETRIEVED')
                    .withDetails('Please try again.')
                    .withDocsUrl(`${docsUrl}#retrieve-a-list-of-products`);
            }
        });
});

/**
 * GET /products/{sku}
 * @summary Retrieve a single product by SKU
 * @tags Products
 * @param {string} sku.path - SKU of the product - eg: XX-1234-56
 * @return {APIResponse} 200 - Success response
 * @return {ErrorResponse} 404 - Product not found
 * @see ./docs/jsdoc/getOne.js
 */
products.get(skuRegex, async (req, res, next) => {
    const {sku} = req.params;
    const product = await Product.findOne({sku}, {__v: 0, _id: 0});

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
        .send({
            message: 'The product has been successfully retrieved.',
            product: product
        });
});

/**
 * POST /products
 * @summary Add a new product
 * @tags Products
 * @param {Product} request.body.required - Product object to be added - application/json
 * @security BearerAuth
 * @returns {APIResponse} - 201 - Product created successfully
 * @returns {ErrorResponse} - 401 - Unauthorized
 * @returns {ErrorResponse} - 403 - Forbidden
 * @returns {ErrorResponse} - 404 - Product not found
 * @returns {ErrorResponse} - 409 - Product already exists
 * @returns {ErrorResponse} - 422 - Validation errors
 * @returns {ErrorResponse} - 500 - Product could not be saved
 * @see ./docs/jsdoc/add.js
 */
products.post('/', auth, async (req, res, next) => {
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

    if (await Product.exists({sku})) {
        throw new ConflictError('Product with SKU already exists.')
            .withCode('RESOURCE_ALREADY_EXISTS')
            .withDocsUrl(endpointDocsUrl)
            .withDetails('Please change the SKU and try again, or update the existing product.');
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
 * PUT /products/{sku}
 * @summary Replace a product by SKU
 * @tags Products
 * @param {string} sku.path - SKU of the product - eg: XX-1234-56
 * @param {Product} request.body.required - Product object to replace - application/json
 * @security BearerAuth
 * @returns {APIResponse} 200 - Product replaced successfully
 * @returns {ErrorResponse} 404 - Product not found
 * @returns {ErrorResponse} 422 - Validation errors
 * @returns {ErrorResponse} 500 - Product could not be replaced
 * @see ./docs/jsdoc/replace.js
 */
products.put(skuRegex, auth, async (req, res, next) => {
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
 * PATCH /products/{sku}
 * @summary Update a product by SKU
 * @tags Products
 * @param {string} sku.path - SKU of the product - eg: XX-1234-56
 * @param {Product} request.body.required - Product object to update - application/json
 * @security BearerAuth
 * @returns {APIResponse} 200 - Product updated successfully
 * @returns {ErrorResponse} 400 - Update not allowed
 * @returns {ErrorResponse} 404 - Product not found
 * @returns {ErrorResponse} 422 - Update fields required
 * @returns {ErrorResponse} 422 - Validation errors
 * @returns {ErrorResponse} 500 - Resource not updated
 * @see ./docs/jsdoc/update.js
 */
products.patch(skuRegex, auth, async (req, res, next) => {
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
 * DELETE /products/{sku}
 * @summary Remove a product by SKU
 * @tags Products
 * @param {string} sku.path - SKU of the product - eg: XX-1234-56
 * @security BearerAuth
 * @returns {APIResponse} 200 - Product deleted successfully
 * @returns {ErrorResponse} 404 - Product not found
 * @returns {ErrorResponse} 500 - Product could not be deleted
 * @see ./docs/jsdoc/delete.js
 */
products.delete(skuRegex, auth, async (req, res, next) => {
    const {sku} = req.params;
    const endpointDocsUrl = `${docsUrl}#remove-a-product`;

    await Product.findOneAndDelete({sku}, {
        includeResultMetadata: true
    })
        .exec()
        .then((result,) => {
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