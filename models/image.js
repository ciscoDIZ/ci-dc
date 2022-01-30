const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    caption: {type: String, required: true},
    filename: {type: String, required: true},
    fileId: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now()}
});

module.exports = mongoose.model('Image', ImageSchema);