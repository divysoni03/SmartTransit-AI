const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { ApiError } = require('../utils/apiResponse');
const { User } = require('../models');

const auth = () => async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Please authenticate');
        }

        const token = authHeader.split(' ')[1];

        let payload;
        try {
            payload = jwt.verify(token, config.jwt.secret);
        } catch (error) {
            throw new ApiError(401, 'Invalid or expired token');
        }

        if (payload.type !== 'access') {
            throw new ApiError(401, 'Invalid token type');
        }

        const user = await User.findById(payload.sub);
        if (!user) {
            throw new ApiError(401, 'User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = auth;
