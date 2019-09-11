const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    imgTitle: String,
    imgUrl: String
});

module.exports = mongoose.model('Images', imageSchema);
