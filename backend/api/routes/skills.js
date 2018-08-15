const express = require('express');
const router = express.Router();
const Skill = require('../models/skill');
const mongoose = require('mongoose');
const multer = require('multer');
const authCkeck = require('../middleware/check-auth');
const skillController = require('../controllers/skillController');

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
 * API [GET] for route /skills 
 */

router.get('/', skillController.get_all_skills);



/**
 * API [POST] for route /skills
 */


router.post('/', upload.any(), skillController.post_skill);



/**
 * API [GET] for route /skills/community/skillForCommunity
 */

router.get('/community/:id', authCkeck, skillController.get_skill_by_communityId);


/**
 * API [GET] foor route /skills/id
 */

router.get('/:id', skillController.get_skill_by_id);


/*
 *  API [PATCH] for route /skills/communityId
 */


router.patch('/:id', upload.any(), skillController.patch_skill);

module.exports = router;