const mongoose = require('mongoose');

const filesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: String, required: true},
    filePath : {type: String, required: true},
    fileName : {type: String, },
    fileType : {type: String, },
    fileSize : {type: String, },
});

module.exports = mongoose.model('VaultFile', filesSchema);