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


/* 
 ** API [GET] [POST] for route /users/user/community/add
 */

router.post('/user/community/create',  upload.any(), userController.post_userMobile);



/* 
 ** API [GET] [GET] for route /users
 */


router.get('/', userController.get_all_users);


/*
 ** API [GET] for route /users/active
 */

router.get('/community/:communityId', userController.getAllusersByCommunityId);


/*
 ** API [GET] for route /users/coomunity/app/:communityId
 */


router.get('/app/community/:communityId', userController.getAllusersByCommunityIdMobile);

/*
 ** API [PUT] for route /users/firstConnection/:userid [USED]
 */

router.put('/firstConnection/:userId', userController.updateUserByfirstConnection)


/*
 **  API [GET] for route /user/:id
 */

router.get('/:id', userController.get_user_by_id);


/*
 ** API [GET] for route /users/id/communityId   [USED]
 */

router.get('/:id/:communityId', userController.get_userId_communityId);


/*
 ** API [POST] for route /users/invite/contacts/:userId/:activeCommunity   [USED]
 */


router.post('/invite/contacts/:userId/:activeCommunity', userController.postInvitedContacts)

/*
 ** API [PATCH] for route /users/id/communityId   [USED]
 */

router.put('/:id/:communityId',  authCkeck, userController.put_userId_communityId_EditUser);


/*
 ** API [PATCH] for route /users/delete/id/communityId   [USED]
 */

router.put('/delete/:id/:communityId',  authCkeck, userController.put_userId_communityId_DeleteUser);


/*
 ** API [POST] for route /users/create/newaccount   [USED]
 */

router.post('/create/newaccount',userController.creatAnewAccount);

/*
 ** API [PUT] for route /users/profile/user/:userId/community/:communityId   [USED]
 */

router.put('/profile/user/:userId/community/:communityId',userController.editProfile);

/*
 ** API [POST] for route /users/account/psw/user/:userId [USED]
 */

router.post('/account/psw/user/:userId',userController.checkPsw);

/*
 ** API [PUT] for route /users/account/psw/user/:userId [USED]
 */

router.put('/account/psw/user/:userId' ,userController.updatePsw);

/*
 ** API [GET] for route /users/account/info/:userId [USED]
 */

router.get('/account/info/:userId' ,userController.getAccountInfo);

/*
 ** API [PUT] for route /users/account/info/:userId [USED]
 */

router.put('/account/info/:userId' ,userController.updateAccountInfo);

/*
 ** API [GET] for route /users/list/invitation/:userId/community/:communityId [USED]
 */

router.get('/list/invitation/:userId/community/:communityId' ,userController.getListInvitationn);

/*
 ** API [GET] for route /users/list/invitation/:userId/community/:communityId [USED]
 */

router.put('/update/invitation/:userId/community/:communityId' ,userController.updateInvitationNotification);


/*
 ** API [GET] for route /users/list/invitation/:userId/community/:communityId [USED]
 */

router.get('/count/invitation/:userId/community/:communityId' ,userController.countNotificationbyUserId);


/*
 ** API [POST] for route /users/invitation/accepted/:userId/community/:communityId [USED]
 */

router.post('/invitation/accepted/:userId/community/:communityId' ,userController.statusAccepetedInvitation);

module.exports = router;