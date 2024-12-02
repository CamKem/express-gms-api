import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            validate: {
                validator: (v) => /^[A-Z]{2}-\d{4}-\d{2}$/.test(v),
                message: (props) => {
                    return `${props.value} is not a valid SKU!`
                        + `A valid SKU should be in the format of XX-1234-56`;
                }
            }
        },
        name: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (v) => /^[a-zA-Z ]+$/.test(v),
                message: (props) => {
                    `${props.value} is not a valid name! (letters and spaces only)`
                },
            },
        },
        price: {
            type: Number,
            required: true,
            min: [0, 'Price must be a non-negative number'],
        },
        stockOnHand: {
            type: Number,
            required: true,
            min: [0, 'Stock must be a non-negative number'],
        },
    }, {
        timestamps: true,
    });

const Product = mongoose.model('Product', ProductSchema);

export default Product;