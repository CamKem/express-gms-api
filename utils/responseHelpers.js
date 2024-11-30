export default function responseHelpers(req, res, next) {
    res.success = function (data, message = 'Success', statusCode = 200) {
        res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    };

    res.error = function (message = 'Error', statusCode = 500) {
        res.status(statusCode).json({
            success: false,
            message,
        });
    };

    next();
}