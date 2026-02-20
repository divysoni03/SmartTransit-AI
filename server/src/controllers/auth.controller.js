const { authService } = require('../services');
const asyncHandler = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/apiResponse');

const register = asyncHandler(async (req, res) => {
    const user = await authService.createUser(req.body);
    const tokens = await authService.generateAuthTokens(user);
    res.status(201).send(new ApiResponse(201, { user, tokens }, 'User registered successfully'));
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await authService.generateAuthTokens(user);
    res.send(new ApiResponse(200, { user, tokens }, 'Login successful'));
});

const getMe = asyncHandler(async (req, res) => {
    // User is attached to req by the auth middleware
    res.send(new ApiResponse(200, { user: req.user }, 'User details fetched'));
});

module.exports = {
    register,
    login,
    getMe
};
