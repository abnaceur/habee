const express = require('express');
const router = express.Router();
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

router.get('/', authCkeck, eventController.get_all_events);


/*
 * API [GET] for route /events/:eventId/community/:communitId [USED]
 */

router.get('/:eventId/community/:communityId', authCkeck, eventController.eventByCommunityId)

/*
 * API [GET] for route /events/community/:communitId [USED]
 */

router.get('/community/:communityId', authCkeck,  eventController.get_all_events_byCommunityId);


/*
 * API [GET] for route /events/filter/:userId/community/:communityId [USED]
 */

router.get('/filtered/user/:userId/community/:communityId', authCkeck, eventController.getFilteredEvent);


/*
 * API [GET] for route /events/filter/:userId/community/:communityId [USED]
 */

router.get('/filter/:userId/community/:communityId', authCkeck, eventController.getEventFilter);


/*
 * API [POST] for route /events/filter/:userId/community/:communityId [USED]
 */

router.post('/filter/:userId/community/:communityId', authCkeck, eventController.postEventFilter);


/*
 * API [GET] for route /events/user/:userId/community/ [TOBE USED]
 */

router.get('/user/:userId/community', authCkeck, eventController.getNoevent)



/*
 * API [GET] for route /events/user/:userId/community/:communityId [TOBE USED]
 */

router.get('/user/:userId/community/:communityId', authCkeck, eventController.getEvntByUserIdAndCommunityId)

/**
 * API [POST] for route /events/mobile/photo/upload [USED]
 */

router.post('/mobile/photo/upload', upload.any(), eventController.upload_mobile_photo);


/**
 * API [POST] for route /events [USED]
 */


router.post('/', upload.any(), authCkeck, eventController.post_event);

/**
 * API [POST] for route /events/:eventId/user/:userId [USED]
 */

router.get('/:eventId/issubscribed/:userId/community/:communityId', authCkeck, eventController.get_userEventSubscribed)


/**
 * API [GET] foor route /events/eventId
 */

router.get('/:eventId', authCkeck, eventController.get_event_by_id);

/**
 * API [PUT] foor route /events/delete/:eventId/community/:communityId [USED]
 */

router.put('/edit/:eventId/community/:communityId', authCkeck, eventController.deleteEventByCommunityId)


/**
 * API [PUT] foor route /events/:eventId/user/:userId/community/:communityId [USED]
 */

router.put('/:eventId/user/:userId/community/:communityId', authCkeck, eventController.put_eventByUserId);


/*
 ** API route [PUT] for /events/all/isOver [USED]
 */

router.put('/all/isover/:userId/:communityId', authCkeck, eventController.put_all_events_isOver);


/*
 ** API route [GET] for /events/comments [USED]
 */

router.get('/comments/:eventId/community/:communityId', eventController.getCommentByEventId);


module.exports = router;