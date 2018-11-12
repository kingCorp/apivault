const mongoose = require('mongoose');
const VaultFile = require('../models/fileModel');


//
exports.files_get_all = (req, res, next) => {
    VaultFile.find()
    //.select('_id fileType userId')
    .exec()
    .then(docs => {
        console.log(docs)
        const response = {
            count: docs.length,
            fileInfo: docs.map(doc => {
                return{
                    _id: doc._id,
                    userId: doc.userId,
                    file: doc.fileType,
                    request:{
                        type: 'GET',
                        url: 'https://rnvault.herokuapp.com/files/'+doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: err });
    });
    
}


exports.files_get_all_user = (req, res, next) => {
    const userId = req.params.userId;
    VaultFile.find({userId: userId})
    //.select('_id userId fileNa')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            message: 'process successful',
            fileInfo: docs,
            request:{
                type: 'GET',
                url: 'https://rnvault.herokuapp.com/files/'+docs[0]._id
            }
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: err });
    });
    
}



//post files
exports.files_create_files = (req, res, next) => {
    console.log(req.file);
    const myfile = new VaultFile({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId,
        filePath: req.file.path,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: Math.floor(req.file.size/1000) 
    });
    myfile.save().then(result => {
        console.log(result);
        res.status(200).json({
            message: "uploaded successfully",
            details: {
                _id: result._id,
                userId: result.userId,
                filePath: result.filePath,
                fileName: result.fileName,
                fileType: result.fileType,
                fileSize: result.fileSize,
                request:{
                    type: 'GET',
                    url: 'https://rnvault.herokuapp.com/files/'+result._id
                }
            }
        })
    })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err, message: 'Could not save' });
        });
}



//get file by ID
exports.files_get_byID = (req, res, next) => {
    const id = req.params.fileId
    VaultFile.findById(id)
       // .select('_id userId fileType')
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc !== null){
                res.status(200).json({
                    message: "sucessfull",
                    doc
                });
            }else{
                res.status(200).json({message: "ID doesnt exist or has been deleted"});
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err , message: "ID Not FOUND"});
        });
}



//Update file by ID
exports.files_update_byID = (req, res, next) => {
    const id = req.params.fileId;
    const updateOps = {};
    for(let ops in updateOps){
        updateOps[ops.propName] = ops.value
    }
    File.update({_id: id}, {
        $set: updateOps
    })
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({
            message: 'Updated successfully',
            request:{
                type: 'GET',
                url: 'https://rnvault.herokuapp.com/files/'+id
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: err , message: "Could not update"});
    });
}


//delete file controller
exports.files_delete_byID = (req, res, next) => {
    const id = req.params.fileId
    VaultFile.remove({_id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'File Deleted',
            request: {
                type: 'POST',
                url: 'https://rnvault.herokuapp.com/files',
                body: {file: String}
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: err });
    });
}