class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if (err.name === "JsonWebTokenError") {
        err.message = `JSON Web Token is invalid, please try again!`;
        err.statusCode = 401; 
    }

    if (err.name === "TokenExpiredError") {
        err.message = `JSON Web Token has expired, please log in again!`;
        err.statusCode = 401;
    }

    if (err.name === "ValidationError") {
        err.message = `Validation failed: ${Object.values(err.errors)
            .map((e) => e.message)
            .join(", ")}`;
        err.statusCode = 400;
    }

    if (err.name === "TaskNotFoundError") {
        err.message = `Task with the given ID not found`;
        err.statusCode = 404; 
    }
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

module.exports = {ErrorHandler,errorMiddleware };
