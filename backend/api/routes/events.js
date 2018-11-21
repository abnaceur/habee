const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const mongoose = require('mongoose');
const multer = require('multer');
const authCkeck = require('../middleware/check-auth');
const eventController = require('../controllers/eventController');

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
 * API [GET] for route /events
 */

router.get('/', eventController.get_all_events);


/*
 * API [GET] for route /events/:eventId/community/:communitId [USED]
 */

router.get('/:eventId/community/:communityId', eventController.eventByCommunityId)

/*
 * API [GET] for route /events/community/:communitId
 */

router.get('/community/:communityId', eventController.get_all_events_byCommunityId);

/*
 * API [GET] for route /events/user/:userId/community/:communityId [TOBE USED]
 */

 router.get('/user/:userId/community/:communityId', eventController.getEvntByUserIdAndCommunityId)

/**
 * API [POST] for route /events/mobile/photo/upload [USED]
 */

 router.post('/mobile/photo/upload', upload.any(),  eventController.upload_mobile_photo);


/**
 * API [POST] for route /events [USED]
 */


router.post('/', upload.any(), eventController.post_event);

/**
 * API [POST] for route /events/:eventId/user/:userId [USED]
 */

 router.get('/:eventId/issubscribed/:userId/community/:communityId', eventController.get_userEventSubscribed)

 /**
 * API [POST] for route /events/:eventId/users/:userId [USED]
 */

/**
 * API [GET] foor route /events/eventId
 */

router.get('/:eventId', eventController.get_event_by_id);

/**
 * API [PUT] foor route /events/delete/:eventId/community/:communityId [USED]
 */

 router.put('/edit/:eventId/community/:communityId', eventController.deleteEventByCommunityId)


 /**
 * API [PUT] foor route /events/:eventId/user/:userId/community/:communityId [USED]
 */

 router.put('/:eventId/user/:userId/community/:communityId', eventController.put_eventByUserId);
 
/**
 *  API [PATCH] for route /events/eventId
 */


router.patch('/:eventId', authCkeck, upload.any(), eventController.patch_event);


/*
 ** API route [PUT] for /events/all/isOver
 */

router.put('/all/isover/:userId/:communityId', eventController.put_all_events_isOver);


/*
 ** API route [GET] for /events/all/isOver
 */

router.get('/all/isover', authCkeck, eventController.get_all_events_isOver);


/*
 ** API route [GET] for /events/all/isNotOver
 */

router.get('/all/isnotover', authCkeck, eventController.get_all_events_isNotOver);


/*
 ** API [GET] for route /events/community/communityId
 */

 // TODO THERE ARE A REPETITION
//router.get('/community/:eventCommunity', authCkeck, eventController.get_event_by_communityId);


/*
 ** API [GET] for route /events/communityId/isOver   
 */

router.get('/:eventCommunity/isover', authCkeck, eventController.get_eventIsOver_by_communiyId);


/*
 ** API [PATC] for route /events/communityId/isOver   
 */

router.patch('/:eventCommunity/isover', authCkeck, eventController.patch_eventIsOver_by_communiyId);



/*
 ** API [GET] for route /events/communityId/isNotOver   
 */

router.get('/:eventCommunity/isnotover', authCkeck, eventController.get_eventIsNotOver_by_communiyId);


/*
 ** API [PATC] for route /events/communityId/isNotOver   
 */

router.patch('/:eventCommunity/isnotover', authCkeck, eventController.patch_eventIsOver_by_communiyId);



module.exports = router;