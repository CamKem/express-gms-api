import mongoose from 'mongoose';

// Define the User schema
const EmployeeSchema = new mongoose.Schema({
    empId: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: (v) => /^\d{3}$/.test(v),
            message: (props) =>
                `${props.value} is not a valid employee ID! A valid employee ID should be a 3-digit number`,
        },
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v) => /^[A-Za-z\s\-]{2,50}$/.test(v),
            message: (props) =>
                `${props.value} is not a valid first name! A valid first name should be 2-50 characters long`,
        },
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v) => /^[A-Za-z\s\-]{2,50}$/.test(v),
            message: (props) =>
                `${props.value} is not a valid last name! A valid last name should be 2-50 characters long`,
        },
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;