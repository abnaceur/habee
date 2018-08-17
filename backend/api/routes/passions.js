const express = require('express');
const router = express.Router();
const Passion = require('../models/passion');
const mongoose = require('mongoose');
const multer = require('multer');
const authCkeck = require('../middleware/check-auth');
const passionController = require('../controllers/passionController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        // Rename the uplaoded file
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Define the extension of the file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);
    else
        cb(null, false);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

/*
 * API [GET] for route /passions 
 */

router.get('/', passionController.get_all_passions);


/**
 * API [GET] foor route /passions/communityId
 */

router.get('/:id', passionController.get_passion_by_communityId);



/**
 * API [GET] foor route /passions/id
 */

router.get('/:id', authCkeck, passionController.get_passion_by_id);



/**
 * API [POST] for route /passions
 */


router.post('/',  upload.any(), passionController.post_passion);

/**
 *  API [PATCH] for route /passions/id
 */


router.patch('/:id', authCkeck, upload.any(), passionController.patch_passion);


module.exports = router;