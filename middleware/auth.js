const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse("You Must Log In...", 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();

    } catch (error) {
        return next(new ErrorResponse("You must Log in", 401))
    }
}

// middleware for admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role === 'user') {
        return next(new ErrorResponse('Access Denied, You must be an Admin', 401));
    }
    next();
}