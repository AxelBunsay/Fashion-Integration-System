const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    name: String,
    timeIn: Date,
    branch: String,
    purpose: String,
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);