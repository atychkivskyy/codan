const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send('Access Denied / Unauthorized request');
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).send('Admin privileges required');
    }
    next();
};
