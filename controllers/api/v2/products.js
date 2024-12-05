import express from 'express';
import Product from '../../../models/Product.js';
import {
    BadRequestError,
    ConflictError,
    InternalServerError,
    NotFoundError,
    UnprocessableEntityError
} from '../../../utils/errors.js';
import {APIResponse} from "../../../utils/responses.js";
import {setValue} from "../../../utils/setValue.js";
import mapValidationErrors from "../../../utils/mapValidationErrors.js";
import auth from "../../../middleware/authHandler.js";

/**
 * Product controller
 * @type {Router}
 *
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
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
    /**
     * @swagger
     * /products:
     *   get:
     *     summary: Retrieve a list of products
     *     tags: [Products]
     *     responses:
     *       200:
     *         description: A list of products
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Product'
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/InternalServerError'
     */

    // in terms of query parameters to allow filtering, sorting, and pagination we need to consider the following:
    // 1. Filtering: We can filter products by name, price, and stockOnHand.
    // 2. Sorting: We can sort products by name, price, and stockOnHand. and a direction (ascending or descending).
    // 3. Pagination: We can paginate products by specifying a page number and a page size.
    // 4. Limiting: We can limit the number of products returned by specifying a limit.
    // 5. Fields: We can specify the fields to return in the response.
    // 6. Search: We can search for products by name, price, and stockOnHand.
    // 7. Aggregation: We can aggregate products by name, price, and stockOnHand.
    // 8. Grouping: We can group products by name, price, and stockOnHand.
    // 9. Projection: We can project products by name, price, and stockOnHand.

    // TODO: lets build an abstraction, that can handle all of the above query string parameters
    //  then we can use it to apply to any mongoose model query we need, we can even set up configuration
    //  which will change what we allow for any particular instance of the abstraction.
    //  thing like ?fields=name,price,stockOnHand&sort=name:asc&limit=10&page=1&search=product&aggregate=name,price,stockOnHand&group=name,price,stockOnHand&project=name,price,stockOnHand
    //  we can make it dynamic using [ square brackets to group multiple values, and : to separate the field and direction
    //  for example ?fields=[name,price,stockOnHand]&sort=[name:asc,price:desc]&limit=10&page=1&search=product&aggregate=[name,price,stockOnHand]&group=[name,price,stockOnHand]&project=[name,price,stockOnHand]

    const products = await Product.find({}, {__v: 0, _id: 0})
        .exec()
        .then(products => products)
        .catch(err => {
            if (err) {
                throw new InternalServerError('Products could not be retrieved.')
                    .withCode('RESOURCE_NOT_RETRIEVED')
                    .withDetails('Please try again.')
                    .withDocsUrl(docsUrl);
            }
        });

    new APIResponse(req)
        .withCode('RESOURCE_RETRIEVED')
        .withDocsUrl(docsUrl)
        .send(products);
});

/**
 * @route   GET /products/:sku
 * @desc    Get a product by SKU
 * @access  Public
 */
products.get(skuRegex, async (req, res, next) => {
    /**
     * @swagger
     * /products/{sku}:
     *   get:
     *     summary: Retrieve a product by SKU
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: sku
     *         required: true
     *         schema:
     *           type: string
     *           pattern: '^[A-Z]{2}-\d{4}-\d{2}$'
     *           description: The SKU of the product (Format: XX-XXXX-XX)
     *     responses:
     *       200:
     *         description: A product
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Product'
     *       404:
     *         description: Product not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/NotFoundError'
     */

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
        .send(product);
});

/**
 * @route   POST /products
 * @desc    Add a new product
 * @access  Private
 *
 * @param {string} sku - Product SKU
 * @param {string} name - Product name
 * @param {number} price - Product price
 * @param {number} stockOnHand - Product stock on hand
 * @returns {object} - Product object
 * @throws {UnprocessableEntityError} - 422 - Validation errors
 * @throws {ConflictError} - 409 - Product already exists
 * @throws {InternalServerError} - 500 - Product could not be saved
 * @throws {UnauthorizedError} - 401 - Unauthorized
 * @throws {ForbiddenError} - 403 - Forbidden
 * @throws {NotFoundError} - 404 - Not found
 */
products.post('/', auth, async (req, res, next) => {
    /**
     * @swagger
     * /products:
     *   post:
     *     summary: Add a new product
     *     tags: [Products]
     *     security:
     *       - jwt: []
     *     requestBody:
     *       description: Product object to be added.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/NewProduct'
     *     responses:
     *       201:
     *         description: Product created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Product'
     *       400:
     *         description: Bad request.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BadRequestError'
     *       409:
     *         description: Product already exists.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ConflictError'
     *       422:
     *         description: Validation errors.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UnprocessableEntityError'
     */

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
 * @route   PUT /products/:sku
 * @desc    Replace a product by SKU
 * @access  Public
 */
products.put(skuRegex, async (req, res, next) => {
    /**
     * @swagger
     * /products/{sku}:
     *   put:
     *     summary: Replace a product by SKU
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: sku
     *         required: true
     *         schema:
     *           type: string
     *           pattern: '^[A-Z]{2}-\d{4}-\d{2}$'
     *         description: "The SKU of the product (Format: XX-XXXX-XX)"
     *     requestBody:
     *       description: Product object to replace.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Product'
     *     responses:
     *       200:
     *         description: Product replaced successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Product'
     *       404:
     *         description: Product not found.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/NotFoundError'
     *       422:
     *         description: Validation errors.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UnprocessableEntityError'
     */

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
    /**
     * @swagger
     * /products/{sku}:
     *   patch:
     *     summary: Update a product by SKU
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: sku
     *         required: true
     *         schema:
     *           type: string
     *           pattern: '^[A-Z]{2}-\d{4}-\d{2}$'
     *         description: "The SKU of the product (Format: XX-XXXX-XX)"
     *     requestBody:
     *       description: Fields to update in the product.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               price:
     *                 type: number
     *               stockOnHand:
     *                 type: number
     *     responses:
     *       200:
     *         description: Product updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Product'
     *       400:
     *         description: Bad request.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BadRequestError'
     *       404:
     *         description: Product not found.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/NotFoundError'
     *       422:
     *         description: Validation errors.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UnprocessableEntityError'
     */

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
    /**
     * @swagger
     * /products/{sku}:
     *   delete:
     *     summary: Remove a product by SKU
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: sku
     *         required: true
     *         schema:
     *           type: string
     *           pattern: '^[A-Z]{2}-\d{4}-\d{2}$'
     *         description: "The SKU of the product (Format: XX-XXXX-XX)"
     *     responses:
     *       200:
     *         description: Product deleted successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 product:
     *                   $ref: '#/components/schemas/Product'
     *       404:
     *         description: Product not found.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/NotFoundError'
     *       500:
     *         description: Product could not be deleted.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/InternalServerError'
     */

    const {sku} = req.params;
    const endpointDocsUrl = `${docsUrl}#remove-a-product`;

    await Product.findOneAndDelete({sku}, {
        includeResultMetadata: true
    })
        .exec()
        .then((result,) => {
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