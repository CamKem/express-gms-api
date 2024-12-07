import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            trim: true,
            unique: true,
            match: [
                /^[A-Z]{2}-\d{4}-\d{2}$/,
                'SKU should be a string in the format of XX-1234-56'
            ],
        },
        name: {
            type: String,
            required: true,
            trim: true,
            match: [
                /^[a-zA-Z ]+$/,
                'Name should be a string with only letters and spaces'
            ],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be a positive number'],
        },
        stockOnHand: {
            type: Number,
            required: [true, 'Stock on hand is required'],
            min: [0, 'Stock must be a positive number'],
        },
    }, {
        versionKey: false,
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret._id;
                return ret;
            }
        }
    });

/**
 * @summary Grocery product definition
 * @typedef {object} Product
 * @property {string} sku.required - The SKU of the product (Format: XX-XXXX-XX)
 * @property {string} name.required - Product name
 * @property {number} price.required - Product price - int64
 * @property {number} stockOnHand.required - Product stock on hand - int64
 * @property {string} createdAt - Product creation date
 * @property {string} updatedAt - Product last update date
 */
const Product = mongoose.model('Product', ProductSchema);

export default Product;