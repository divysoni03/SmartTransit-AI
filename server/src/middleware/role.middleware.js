const { ApiError } = require('../utils/apiResponse');

const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user must be populated by auth.middleware before this
        if (!req.user || !roles.includes(req.user.role)) {
            next(new ApiError(403, 'Forbidden: Insufficient role permissions'));
        }
        next();
    };
};

module.exports = restrictTo;
