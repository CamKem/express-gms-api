import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {
        orderNo: {
            type: Number,
            required: true,
            // we can't use unique each document is an order item, not an order
            validate: {
                validator: (v) => /^\d{4}$/.test(v),
                message: (props) =>
                    `${props.value} is not a valid order number! A valid order number should be a 4-digit number`,
            }
        },
        orderDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        customerNo: {
            type: Number,
            required: true,
            validate: {
                validator: (v) => /^\d{8}$/.test(v),
                message: (props) =>
                    `${props.value} is not a valid customer number! A valid customer number should be an 8-digit number`,
                // NOTE: should this be validated against a customer collection?
            }
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['Cash', 'Credit', 'Debit', 'PayPal', 'Other'],
            // NOTE: should this be validated against a payment collection?
        },
        productSku: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (v) => /^[A-Z]{2}-\d{4}-\d{2}$/.test(v),
                message: (props) =>
                    `${props.value} is not a valid SKU! A valid SKU should be in the format of XX-1234-56`,
            },
        },
        productName: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (v) => /^[A-Za-z0-9\s()\-_\/.]{2,50}$/.test(v),
                message: (props) =>
                    `${props.value} is not a valid product name! A valid product name should be 2-50 characters long`,
            },
        },
        productPrice: {
            type: Number,
            required: true,
            min: [0, 'Product price must not be a negative number'],
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
        }
    }, {
        timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;