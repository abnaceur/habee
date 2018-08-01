const express = require('express');
var stringify = require('json-stringify');
const router = express.Router();
const Community = require('../models/community');
const mongoose = require('mongoose');


// route '/'
router.get('/', (req, res, next) => {
    let counting = 0;

    Community.find()
    .exec()
    .then(docs => {

        Community.find().count()
        .exec()
        .then(docs1 => {
            res.status(200).json(docs1);
        })
        .catch();
        res.status(200).json({
            Number: counting,
            Commuinities: docs
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
});


router.post('/', (req, res, next) => {
    const community = new Community({
        _id : new mongoose.Types.ObjectId,
        communityId: req.body.communityId,
        communityName: req.body.communityName,
        communityLogo: req.body.communityLogo,
        communityAdmin: req.body.communityAdmin,
        communityMembers: req.body.communityMembers,
        dateOfCreation: req.body.dateOfCreation,
        dateOfLastUpdate: req.body.dateOfLastUpdate,
        companyName: req.body.companyName,
        clientId: req.body.clientId,
        communityIsActive: req.body.communityIsActive
    });
    community
    .save()
    .then(res => {
        console.log(res);
    })
    .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling [POST] request to /communites',
        CreateCommunity: community
    });
});

// rout /:id
router.get('/:id', (req, res, next) => {
    const _id = req.params.id;
     Community.find()
    .exec()
    .then(res => {
        console.log(res);
        res.status(200).json(res);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            Error: err
        });
    });
});

router.post('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: 'Handling [POST/:id] request to /communites/' + id,
    });
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: 'Handling [PATCH/:id] request to /communites/' + id,
    });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: 'Handling [DELETE/:id] request to /communites/' + id,
    });
});


module.exports = router;