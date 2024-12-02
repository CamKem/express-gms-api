import mongoose from 'mongoose';
import Product from "./Product.js";

const ProductSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        trim: true,
        match: [/^[A-Z]{2}-\d{4}-\d{2}$/, '{PATH} is not a valid SKU! A valid SKU should be in the format of XX-1234-56'],
        validate: {
            validator: async function (sku) {
                const product = await Product.findOne({ sku });
                return !!product;
            },
            message: props => `SKU '${props.value}' does not exist in the Product collection.`,
        },
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
        required: true,
        unique: true,
    },
    products: {
        type: [ProductSchema],
        validate: [arrayLimit, '{PATH} exceeds the limit of 100'],
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
});

function arrayLimit(val) {
    return val.length <= 100;
}

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;