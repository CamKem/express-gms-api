const mongoose = require('mongoose');

// Define Mongoose schema's properties/structure
// DOCS: Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
// DOCS: By default, Mongoose adds an _id property to your schemas.
const schema = new mongoose.Schema({
    id: {
        required: true,
        type: Number
    },
    name: {
        required: true,
        trim: true,
        // minlength: [2, 'Name must be at least 2 characters.'],
        // maxlength: [50, 'Name must be at most 50 characters.'],
        // Example of custom validation logic
        validate: {
            // Function returns true when value is considered valid (logic can be as complex as needed)
            validator: function(val) {
                
                // Regular expression (regex) patterns for valid data
                const regexCode = /^[A-Za-z ]{2,50}$/

                // Test value against regex
                return regexCode.test(val)
            },
            message: () => `Name must be 2-50 characters (letters and spaces only).`
        },
        type: String
    },
    description: {
        required: false,
        maxlength: [500, 'Description must be at most 500 characters.'],
        type: String
    }
})

// Convert schema to Mongoose model
// DOCS: Models are responsible for creating and reading documents from the underlying MongoDB database.
// DOCS: Mongoose automatically looks for the plural, lowercased version of your model name
module.exports = mongoose.model('Example', schema)