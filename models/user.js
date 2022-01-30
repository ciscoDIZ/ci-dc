"use strict";

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            index: {unique: true}
        },
        password: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        lastCacheAt: {
            type: Date,
            required:true,
            default: Date.now
        },
        activated: {
            type: Boolean,
            required: true,
            default: false
        }
    }
);

UserSchema.plugin(mongoosePaginate);

let User = mongoose.model('User', UserSchema);

module.exports =  User;