const mongoose = require('mongoose');

const filesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: String, required: true},
    fileType : {type: String, required: true}
});

module.exports = mongoose.model('VaultFile', filesSchema);