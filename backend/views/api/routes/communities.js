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

router.get('/', authCkeck, communityController.get_all_communities);

/*
 ** API [GET] for route /communites/creator/:userId []USED  
 */

router.get('/creator/:userId', authCkeck, communityController.getCommunityByCreator);

/*
 ** API [POST] for route /communites/creator/:userId []USED  
 */

router.post('/creator/:userId', authCkeck, communityController.addCommunityByCreator);

/*
 ** API [POST] for route /communites/selected/:communityId/:userId []USED  
 */

router.post('/selected/:communityId/:userId', authCkeck, communityController.updateSelectedCommunity);


/*
 ** API routes [GET] [PATCH] for /communities/id
 */

router.get('/:id', authCkeck, communityController.get_community_by_id);

/*
 ** API routes [PUT] [PATCH] for /communities/id [USED]
 */

router.put('/:communityId', authCkeck, communityController.put_community_by_id);


/*
 ** API routes [PUT] [PATCH] for /communities/delete/:communityId [USED]
 */

router.put('/delete/:communityId', authCkeck, communityController.putDeleteCommunity)


/*
 ** API routes [GET] /communities/byparticipation/:userId [USED]
 */

router.get('/byparticipation/:userId', authCkeck, communityController.getCommunitiesByParticipation);


module.exports = router;