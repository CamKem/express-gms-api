import mongoose from 'mongoose';
import Product from "./Product.js";
import { BadRequestError } from '../utils/errors.js';

const ProductSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        trim: true,
        match: [/^[A-Z]{2}-\d{4}-\d{2}$/, '{PATH} is not a valid SKU! A valid SKU should be in the format of XX-1234-56'],
        // validate: {
        //     validator: async function (sku) {
        //         const product = await Product.findOne({ sku });
        //         return !!product;
        //     },
        //     message: props => `SKU '${props.value}' does not exist in the Product collection.`,
        // },
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
}, { _id: false });

const CartSchema = new mongoose.Schema({
    customerNo: {
        type: Number,
        required: [true, 'Customer number is required'],
        minlength: [8, 'Customer number must be an 8-digit number'],
        maxlength: [8, 'Customer number must be an 8-digit number'],
        match: [/^\d{8}$/, 'Customer number must be an 8-digit number'],
        unique: true,
    },
    products: {
        type: [ProductSchema],
        validate: [arrayLimit, 'A cart cannot have more than 100 products.'],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
});

function arrayLimit(val) {
    return val.length <= 100;
}

CartSchema.pre('save', async function (next) {
    try {
        const skus = this.products.map(product => product.sku);
        const existingProducts = await Product
            .find({ sku: { $in: skus } })
            .select('sku');

        const existingSkus = existingProducts.map(product => product.sku);
        const invalidSkus = skus.filter(sku => !existingSkus.includes(sku));

        if (invalidSkus.length > 0) {
            return next(
                new BadRequestError('Invalid SKU(s) found in the cart. Please remove them and try again.')
                    .withDetails(`SKUs: ${invalidSkus.join(', ')}`)
                    .withCode('CART_SKU_INVALID')
                    .withDocsUrl(`${process.env.DOCUMENTATION_URL}/cart#invalid-skus`)
            );

        }

        next();
    } catch (error) {
        next(error);
    }
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;