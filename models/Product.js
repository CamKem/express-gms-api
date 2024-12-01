import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            required: true,
            unique: true, // Ensures uniqueness on the SKU field
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stockOnHand: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;