"use strict";

const User = require('../models/user');
const {badRequest, internalServerError} = require('../error');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');

const login = async (req, res) => {
    const {payload} = req.body;
    console.log(payload)
    const {API_SECRET} = req.app.locals.config;
    try {
        if(!payload) {
            res.status(400).send(badRequest('falta payload'));
            return;
        }
        const user = await User.findOne({email: payload.email});
        const {activated} = user;
        if (!activated) {
            res.status(401).send(badRequest('falta activación de cuenta'));
            return
        }
        if (!user) {
            res.status(400).send(badRequest('email incorrecto'));
            return;
        }
        const {password} = user;
        const match = await bcrypt.compare(payload.password, password);
        if (!match) {
            res.status(400).send(badRequest('password incorrecto.'));
            return;
        }
        const {id} = user;
        const update = await User.findByIdAndUpdate(id, {lastCacheAt: Date.now()}, {new: true});
        payload.password = password
        res.status(200).send({token: jwt.encode(payload, API_SECRET), authenticatedUser: update});
    } catch (e) {
        res.status(500).send(internalServerError(e));
    }
};

const activate = async (req, res) => {
    const id = req.params.id;
    const {API_SECRET} = req.app.locals.config;
    console.log(id, API_SECRET);
    try {
        const user = await User.findByIdAndUpdate(id, {activated: true}, {new: true});
        if (!user) {
            res.status(404).send({message: 'usuario no encontrado'});
            return;
        }
        const {email, password} = user;
        const payload = {
            email,
            password,
        }
        res.status(200).send({token: jwt.encode(payload, API_SECRET), activatedUser: user});
    } catch (e) {
        res.status(500).send({message: 'error interno'});
    }
}

module.exports = {
    login,
    activate
};