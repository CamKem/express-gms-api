# Future Implementations

[//]: # (TODO: implement a better way to handle the openapi definition / generation)
[//]: # ( using JSDocs doesn't allow us to use inheritance/polymorphism and other features where we could provide better documentation and use schema for all our custom defined error & response objects)

### We could try to use a library like `swagger-jsdoc` to generate the OpenAPI definition

From our JSDocs, we would need to map out how our responses and errors are structured and how we can use inheritance and polymorphism to provide a better documentation and schema for our custom defined error & response objects.

# Look at using inhertitance for these schemas, response examples, and the error responses to reduce duplication.
we might have to use just the yaml implementation of the openapi spec to do this, as the jsdoc doesn't seem to support it.

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
     *         description: "The SKU of the product (Format: XX-XXXX-XX)"
     *     responses:
     *       200:
     *         description: A product
     *         content:
     *           application/json:
     *             schema:
     *               code: 'RESOURCE_RETRIEVED'
     *               data:
     *                 message: The product has been successfully retrieved.
     *                 product:
     *                   $ref: '#/schema/schemas/Product'
     *       404:
     *         description: Product not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/NotFoundError'
     */

## Worth considering
We could look into the openapi spec and just write our own yaml/json files for each endpoint and schema objects, which would be a lot of manual work but would allow us to have a better structure and schema for our responses and errors.

/**
* @swagger
* /employees/login:
*   post:
*     summary: Login an employee
*     tags: [Employees]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/LoginEmployee'
*     responses:
*       200:
*         description: Employee successfully logged in
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/APIResponse'
*      401:
*         description: Invalid credentials
*         content:
*           application/json:
*             schema:
*               $ref: '#/schema/schemas/UnauthorizedError'
*      422:
*         description: Invalid credentials
*         content:
*           application/json:
*             schema:
*               $ref: '#/schema/schemas/UnprocessableEntityError'
*       500:
*         description: Internal Server Error
*         content:
*           application/json:
*             schema:
*               $ref: '#/schema/schemas/InternalServerError'
*/

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
     *             $ref: '#/schema/schemas/NewProduct'
     *     responses:
     *       201:
     *         description: Product created successfully.
     *         content:
     *           code: 'RESOURCE_CREATED'
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/Product'
     *       400:
     *         description: Bad request.
     *         content:
     *           code: 'BAD_REQUEST'
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/BadRequestError'
     *       409:
     *         description: Product already exists.
     *         content:
     *           code: 'RESOURCE_ALREADY_EXISTS'
     *           application/json:
     *             schema:
     *               code: 'RESOURCE_ALREADY_EXISTS'
     *               $ref: '#/schema/schemas/ConflictError'
     *       422:
     *         description: Validation errors.
     *         content:
     *           application/json:
     *             schema:
     *               code: 'VALIDATION_ERROR'
     *               $ref: '#/schema/schemas/UnprocessableEntityError'
     */

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
     *             $ref: '#/schema/schemas/Product'
     *     responses:
     *       200:
     *         description: Product replaced successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/Product'
     *       404:
     *         description: Product not found.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/NotFoundError'
     *       422:
     *         description: Validation errors.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/UnprocessableEntityError'
     */

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
     *               $ref: '#/schema/schemas/Product'
     *       400:
     *         description: Bad request.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/BadRequestError'
     *       404:
     *         description: Product not found.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/NotFoundError'
     *       422:
     *         description: Validation errors.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/UnprocessableEntityError'
     */

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
     *                   $ref: '#/schema/schemas/Product'
     *       404:
     *         description: Product not found.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/NotFoundError'
     *       500:
     *         description: Product could not be deleted.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/InternalServerError'
     */

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
     *                 $ref: '#/schema/schemas/Product'
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/schema/schemas/InternalServerError'
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

[//]: # (TODO: lets build an abstraction, that can handle all of the above query string parameters)
        //  then we can use it to apply to any mongoose model query we need, we can even set up configuration
        //  which will change what we allow for any particular instance of the abstraction.
        //  thing like ?fields=name,price,stockOnHand&sort=name:asc&limit=10&page=1&search=product&aggregate=name,price,stockOnHand&group=name,price,stockOnHand&project=name,price,stockOnHand
        //  we can make it dynamic using [ square brackets to group multiple values, and : to separate the field and direction
        //  for example ?fields=[name,price,stockOnHand]&sort=[name:asc,price:desc]&limit=10&page=1&search=product&aggregate=[name,price,stockOnHand]&group=[name,price,stockOnHand]&project=[name,price,stockOnHand]