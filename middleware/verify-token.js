const jwt = require('jsonwebtoken');
const {application} = require("express");

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.params.token

    if (token) {
        //decoded --> decode edilmiş data
        jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) => {
            if (err) {
                res.json({
                    status: false,
                    message: 'Failed to authenticate token.'
                })
            } else {
                req.decode = decoded;
                next();
            }
        })
    } else {
        res.json({
            status: false,
            message: 'No token provider.'
        })
    }
}
