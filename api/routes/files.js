const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer')
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const FilesController = require('../controllers/files'); 


//store files
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString()+file.originalname)
    }
}); 

const upload = multer({storage: storage});

const VaultFile = require('../models/fileModel');

//get all files
router.get('/', FilesController.files_get_all);

//get all files for each user
router.get('/user/:userId', FilesController.files_get_all_user);

//post files
router.post('/',  upload.single('fileType'), FilesController.files_create_files);

//update files
router.patch('/:fileId', checkAuth, FilesController.files_update_byID);


//get files by ID
router.get('/:fileId', FilesController.files_get_byID);

//delete files
router.delete('/:fileId', FilesController.files_delete_byID);

module.exports = router;