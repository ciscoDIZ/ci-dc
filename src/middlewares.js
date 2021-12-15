"use strict";
const User = require('./models/user');

const jwt = require('jwt-simple');

const response = (res, status, send) => {
    res.status(status).send({message: send});
}

const auth = async (req, res, next) => {
    if (!req.headers.authorization) {
        response(res, 401, 'no authorized');
        return;
    }
    const [prefix, token] = req.headers.authorization.split(' ')
    if (prefix !== 'Bearer') {
        response(res, 400, 'prefix must be Bearer');
        return;
    }
    const {API_SECRET} = req.app.locals.config;
    const payload = jwt.decode(token, API_SECRET);
    const user = await User.findOne({email: payload.email});
    const {password} = user;
    if (!user) {
        response(res, 409, 'payload conflictivo');
        return;
    }
    if (password !== payload.password) {
        response(res, 409, 'payload conflictivo');
        return;
    }
    next();
};

module.exports = {
    auth
}