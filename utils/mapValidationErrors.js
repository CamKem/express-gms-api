/**
 * Maps validation errors to a more readable format
 */
const mapValidationErrors = (validationErrors) => {
    return Object.keys(validationErrors).map(key => {
        const error = validationErrors[key];
        return {
            field: key,
            message: error.message,
            value: error.value,
            reason: error.reason
        };
    });
};

export default mapValidationErrors;