const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.authentication = async (req, res, next) => {
    try {

        var accessToken = req.headers["authorization"];

        if (!accessToken) {
            throw new Error('Authorization required');
        }
        accessToken = accessToken.replace('Bearer ', '');
        var jwtDecodeToken = jwt.decode(accessToken);

        if (!jwtDecodeToken) {
            throw new Error("Invalid Token");
        }

        var user = await User.findOne({
            email: jwtDecodeToken.email
        });

        if (!user) {
            throw new Error('Invalid Token');
        }

        try {
            jwt.verify(accessToken, global.gConfig.JWT_secret);
        } catch (error) {
            return res.status(401).send({
                success: false,
                message: "Invalid User"
            });
        }
        var userData = user.toObject();
        delete userData.password;

        req.data = {
            ...userData
        }
        next();

    } catch (error) {
        res.status(401).send({
            success: false,
            message: error.message
        })
    }
}

exports.authorization = (roles) => {
    return async (req, res, next) => {
        try {
            if (!roles.includes(req.data.role)) {
                throw new Error("You are not authorized to perform this operation");
            }
            next();
        } catch (error) {
            res.status(401).send({
                success: false,
                message: error.message
            })
        }
    }
}