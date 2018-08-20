/**
 * Declared dependencies
 */

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const community = require('../models/community');
const Skill = require('../models/skill');
const mongoose = require('mongoose');
const multer = require('multer');
const Passion = require('../models/passion');
const Event = require("../models/event");
const jwt = require ('jsonwebtoken');
const authCkeck = require('../middleware/check-auth');
const userController = require('../controllers/userController');

//=> End of declared dependencies

/**
 * Multer filter the uplaod file via [POST] and/or [GET] request
 */

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
 * API [POST] for roure /users/login 
 */

 router.post('/login', userController.login_user);

/* 
 ** API [GET] [POST] for route /users
 */


router.post('/',  upload.single('profilePhoto'), userController.post_user);

router.get('/', authCkeck, userController.get_all_users);

/*
 ** API [GET] for route /users/active
 */

router.get('/active', authCkeck, userController.get_all_active_users);


/*
 ** API [GET] for route /users/isNotActive
 */

router.get('/isNotActive', authCkeck, userController.get_all_notActive_users);

/*
 ** API [GET] for route /users/administrators
 */

router.get('/administrators', authCkeck, userController.get_all_admins);


/*
 ** API [GET] for route /users/notAdmin
 */

router.get('/notAdmin', authCkeck, userController.get_all_notAdmins);

/*
 **  API [GET] for route /user/:id
 */

router.get('/:id',  authCkeck, userController.get_user_by_id);

/*
 **  API [PATCH] for route /user/:id
 */

router.patch('/:id', upload.single('profilePhoto'), userController.patch_user_by_id);


/*
 ** API [GET] for route /users/id/credentials 
 */

router.get('/:id/credentials', authCkeck, userController.get_credentials_by_id);

/*
 * API [PATCH] for route /users/id/credentials 
 */

router.patch('/:id/credentials', authCkeck, userController.patch_credentials_by_id);

/*
 ** API [GET] for route /users/id/communityId   
 */

router.get('/:id/:communityId',  authCkeck, userController.get_userId_communityId);

/*
 ** API [PATCH] for route /users/id/communityId   
 */

router.patch('/:id/:communityId',  authCkeck, userController.patch_userId_communityId);

/**
 * API [GET] for route /users/id/communityId/skills
 */

router.get('/:userId/:communityId/skills',  authCkeck, userController.get_skills_by_userId_communityId);

/**
 * API [GET] for route /users/id/communityId/passions
 */

router.get('/:userId/:communityId/passions',  authCkeck, userController.get_passions_by_userId_communityId);

module.exports = router;