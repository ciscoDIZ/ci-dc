"use strict";
const User = require('./models/user');
const {GridFsStorage} = require('multer-gridfs-storage')
const {decode} = require('./services/jwt');
const multer = require("multer");

const response = (res, status, send) => {
    res.status(status).send({message: send});
}
const storage = new GridFsStorage({
    url: 'mongodb+srv://admin:Monst3r_Ripp3r_@app-data.kq6vy.mongodb.net/files?retryWrites=true&w=majority',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const fileName = file.originalname;
            const fileInfo = {
                fileName: fileName,
                bucketName: 'filesBucket'
            };
            resolve(fileInfo);
        });
    }
});
const upload = multer({storage});

const auth = async (req, res, next) => {
    const reqId = req.params.id;
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
    const payload = decode(token, API_SECRET);
    console.log(req.params.id)
    const user = await User.findById(reqId);
    const {id, email} = user;
    if (!user) {
        response(res, 400, 'usuario no encontrado');
        return;
    }
    if (email !== payload.email) {
        response(res, 409, 'payload conflictivo');
        return;
    }
    if (id !== payload.id) {
        response(res, 409, 'payload conflictivo');
        return;
    }
    next();
};

module.exports = {
    auth,
    upload
}