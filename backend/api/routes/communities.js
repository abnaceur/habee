const express = require('express');
const router = express.Router();
const Community = require('../models/community');
const mongoose = require('mongoose');
const multer = require('multer');
const authCkeck = require('../middleware/check-auth');
const communityController = require('../controllers/communityController');

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
 ** API [GET] [POST] for route /communites   
 */

router.get('/', communityController.get_all_communities);


router.post('/',  upload.single('communityLogo'), communityController.post_community);


/*
 ** API route [GET] for /communities/active
 */

router.get('/active', authCkeck, communityController.get_all_active_communities);

/* 
 ** API route [GET] for /communities/isNotActive
 */


router.get('/isNotActive', authCkeck, communityController.get_all_notActive_communities);

/*
 ** API routes [GET] [PATCH] for /communities/id
 */

router.get('/:id', authCkeck, communityController.get_community_by_id);

router.patch('/:id', authCkeck, upload.single('communityLogo'), communityController.patch_community_by_id);

module.exports = router;