import mongoose from 'mongoose';

// Define the User schema
const EmployeeSchema = new mongoose.Schema({
    empId: {
        type: Number,
        // required: [true, 'Employee ID is required'], - we can't require this because we will auto-generate it
        unique: true,
        trim: true,
        match: [/^\d{3}$/, 'Employee ID should be a 3-digit number'],
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minLength: [2, 'First name must be at least 2 characters long'],
        maxLength: [50, 'First name must not exceed 50 characters'],
        match: [/^[A-Za-z\s\-]{2,50}$/, 'First name should contain only letters, spaces, and hyphens'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minLength: [2, 'Last name must be at least 2 characters long'],
        maxLength: [50, 'Last name must not exceed 50 characters'],
        match: [/^[A-Za-z\s\-]{2,50}$/, 'Last name should contain only letters, spaces, and hyphens'],
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true,
        minLength: [6, 'Username must be at least 6 characters long'],
        maxLength: [20, 'Username must not exceed 20 characters'],
        match: [
            /^[a-z0-9_]{6,20}$/,
            'Username should contain only lowercase letters, numbers, and underscores'
        ],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters long'],
        maxLength: [50, 'Password must not exceed 50 characters'],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ],
    },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            delete ret._id;
            return ret;
        }
    }
});

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;