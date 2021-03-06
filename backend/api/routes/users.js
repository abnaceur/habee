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
var ExpressBrute = require('express-brute');
 
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);

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
//TODO bruteforce.prevent
 router.post('/login', userController.login_user);

/* 
 ** API [GET] [POST] for route /users
 */


router.post('/',  upload.single('profilePhoto'), authCkeck, userController.post_user);


/* 
 ** API [GET] [POST] for route /users/user/community/add
 */

router.post('/user/community/create',  upload.any(), authCkeck, userController.post_userMobile);



/* 
 ** API [GET] [GET] for route /users
 */


router.get('/', userController.get_all_users);


/*
 ** API [GET] for route /users/active
 */

router.get('/community/:communityId', authCkeck, userController.getAllusersByCommunityId);


/*
 ** API [GET] for route /users/coomunity/app/:communityId
 */


router.post('/app/community/:page/user/:userId', authCkeck, userController.getAllusersByCommunityIdMobile);

/*
 ** API [PUT] for route /users/firstConnection/:userid [USED]
 */

router.put('/firstConnection/:userId', authCkeck, userController.updateUserByfirstConnection)


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


router.post('/invite/contacts/:userId/:activeCommunity', authCkeck, userController.postInvitedContacts)

/*
 ** API [POST] for route /users/invite/contacts/:userId/:activeCommunity   [USED]
 */


router.post('/invite/contactsbyqrcode/:userId', authCkeck, userController.getInvitedByQrCode)


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

router.post('/create/newaccount', userController.creatAnewAccount);

/*
 ** API [PUT] for route /users/profile/user/:userId/community/:communityId   [USED]
 */

router.put('/profile/user/:userId/community/:communityId', authCkeck, userController.editProfile);

/*
 ** API [POST] for route /users/account/psw/user/:userId [USED]
 */

router.post('/account/psw/user/:userId', authCkeck, userController.checkPsw);

/*
 ** API [PUT] for route /users/account/psw/user/:userId [USED]
 */

router.put('/account/psw/user/:userId' , authCkeck, userController.updatePsw);

/*
 ** API [GET] for route /users/account/info/:userId [USED]
 */

router.get('/account/info/:userId' , authCkeck, userController.getAccountInfo);

/*
 ** API [PUT] for route /users/account/info/:userId [USED]
 */

router.put('/account/info/:userId' , authCkeck, userController.updateAccountInfo);

/*
 ** API [GET] for route /users/list/invitation/:userId/community/:communityId [USED]
 */

router.get('/list/invitation/:userId/community/:communityId/:page', userController.getListInvitationn);

/*
 ** API [GET] for route /users/list/invitation/:userId/community/:communityId [USED]
 */

router.put('/update/invitation/:userId/community/:communityId', authCkeck, userController.updateInvitationNotification);


/*
 ** API [GET] for route /users/list/invitation/:userId/community/:communityId [USED]
 */

router.get('/count/invitation/:userId/community/:communityId', userController.countNotificationbyUserId);


/*
 ** API [POST] for route /users/invitation/accepted/:userId/community/:communityId [USED]
 */

router.post('/invitation/accepted/:userId/community/:communityId', authCkeck, userController.statusAccepetedInvitation);

/*
 ** API [POST] for route /users/invitation/rejected/:userId/community/:communityId [USED]
 */

router.post('/invitation/rejected/:userId/community/:communityId', authCkeck, userController.statusRejectedInvitation);


/*
 ** API [PUT] for route /users/invitation/resend/userId [USED]
 */

router.put('/invitation/resend/:userId', authCkeck, userController.statusResendInvitation);


/*
 ** API [PUT] for route /users/reset/email [USED]
 */

router.post('/reset/email/:email', bruteforce.prevent, userController.resetPassword);

/*
 ** API [POST] for route /users/account/delete/:userId [USED]
 */

router.post('/account/delete/:userId', authCkeck, userController.deleteUserAccount);

/*
 ** API [PUT] for route /users/notification/update/:userId [USED]
 */

router.put('/notification/update/:userId', authCkeck, userController.updateNotificationStatus);

/*
 ** API [GET] for route /users/notification/status/:userId [USED]
 */

router.get('/notification/status/:userId', authCkeck, userController.getNotificationStatus);


/*
 ** API [GET] for route /users/app/allcontacts/:userId [USED]
 */

router.get('/app/allcontacts/:userId', authCkeck, userController.getAllusersCommunityConcat);

/*
 ** API [GET] for route /users/contact/:contactId/community/:communityId [USED]
 */

router.put('/contact/:contactId/community/:communityId', authCkeck, userController.removeCommunityFromContact);

/*
 ** API [PUT] for route /users/invitation/cancel/:userId [USED]
 */

router.put('/invitation/cancel/:userId', authCkeck, userController.cancelInvitationBySender);

module.exports = router;