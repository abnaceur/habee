const express = require('express');
const Community = require('../models/community');
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const utils = require('../services/utils');
const communitySrvice = require('../services/communityServices/communityService')
const communityClass = require('../classes/communityClass');

exports.get_all_communities = (req, res, next) => {

    Community.find()
        .exec()
        .then(communities => {
            console.log("ddf : ", communities.length);
            if (communities.length === 0) {
                return res.status(404).json({
                    code: "101",
                    message: "There are no communities!"
                })
            } else {
                res.status(200).json({
                    Commuinities: communities
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.updateSelectedCommunity = (req, res, next) => {
    const userId = req.params.userId;
    const communityId = req.params.communityId;

    console.log("Commui : ", communityId, userId)

    console.log(userId, communityId);

    User.find({
            userId: userId
        })
        .exec()
        .then(usr => {
            console.log("usr", usr)
            usr[0].activeCommunity = communityId;
            console.log("usr after", usr)
            User.findByIdAndUpdate(usr[0]._id,
                usr[0], {
                    new: false,
                },
                function (err, results) {
                    if (err) return res.status(500).json(err);
                    res.status(200).json({
                        count: 1,
                        msg: "Updated with success !"
                    })
                });
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
}

exports.addCommunityByCreator = (req, res, next) => {
    const userId = req.params.userId;

    //TODO REFACTOR THIS FUNCTION 
    let imagePath = utils.getImagePath(req, req.body.photo);

    console.log("ADD COMMUNITY !!", imagePath)

    Community.find({
            communityId: req.body.communityId,
            communityIsDeleted: false
        }).exec()
        .then(com => {
            if (com.length > 0) {
                res.status(200).json({
                    count: 0,
                    msg: "This name exist !"
                })
            } else {
                User.find({
                        userId: userId
                    }).exec()
                    .then(usr => {
                        console.log("BBBBBBBody : ", req.body, imagePath)
                        const community = new Community({
                            _id: new mongoose.Types.ObjectId,
                            communityId: req.body.communityId,
                            communityName: req.body.communityName,
                            communityLogo: imagePath,
                            communityDescripton: req.body.communityDescripton,
                            communityCreator: req.body.communityCreator,
                            communityMembers: req.body.communityMembers,
                            communityIsActive: req.body.communityIsActive,
                        });
                        community
                            .save()
                            .then(comm => {
                                console.log("Number : ", usr[0].profile.length)
                                usr[0].profile[usr[0].profile.length] = {
                                    "profileUserIsActive": true,
                                    "profileUserIsDeleted": false,
                                    "profileCummunityId": req.body.communityName,
                                    "profilePhoto": usr[0].profile[usr[0].profile.length - 1].profilePhoto,
                                    "profileUsername": usr[0].credentials.firstname + usr[0].credentials.lastname,
                                    "profileIsAdmin": 0
                                }
                                usr[0].communities.push(req.body.communityName);
                                usr[0].filterEvent[usr[0].filterEvent.length] = {
                                    "SportValue": false,
                                    "ArtsValue": false,
                                    "cultureValue": false,
                                    "MediaValue": false,
                                    "musicValue": false,
                                    "socialValue": false,
                                    "internValue": false,
                                    "businessValue": false,
                                    "communityValue": false,
                                    "santeValue": false,
                                    "itValue": false,
                                    "lifestyleValue": false,
                                    "partyValue": false,
                                    "meetingValue": false,
                                    "WorkshopValue": false,
                                    "filterCommunity": req.body.communityName
                                }
                                User.findByIdAndUpdate(usr[0]._id,
                                    usr[0], {
                                        new: false,
                                    },
                                    function (err, results) {
                                        if (err) return res.status(500).json(err);
                                        res.status(200).json({
                                            count: 1,
                                            msg: "Created with success !"
                                        })
                                    })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    Error1: err
                                })
                            });
                    }).catch(err => {
                        res.status(500).json({
                            Error3: err
                        })
                    })

            }
        })
        .catch(err => {
            res.status(500).json({
                Error111: err
            })
        })
}

exports.getCommunityByCreator = (req, res, next) => {
    const userId = req.params.userId;
    communitySrvice.getCommunityByCreator(userId, res)
}

exports.post_community = (req, res, next) => {
    const community = new Community({
        _id: new mongoose.Types.ObjectId,
        communityId: req.body.communityId,
        communityName: req.body.communityName,
        //communityLogo: req.file.path,
        communityAdmin: req.body.communityAdmin,
        communityMembers: req.body.communityMembers,
        companyName: req.body.companyName,
        clientId: req.body.clientId,
        communityIsActive: req.body.communityIsActive,
        communityCurrentEvents: req.body.communityCurrentEvents,
        communityPassedEvents: req.body.communityPassedEvents

    });
    community
        .save()
        .then(com => {
            res.status(200).json({
                community: com
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
};

exports.put_community_by_id = (req, res, next) => {
    const communityId = req.params.communityId
    const communityPhoto = utils.getImagePath(req, req.body.communityLogo)

    communitySrvice.updateCommunity(res, req.body, communityId, communityPhoto)
}

exports.putDeleteCommunity = (req, res, next) => {
    const communityId = req.params.communityId;
    communitySrvice.deleteCommunityById(res, communityId)
}


exports.get_community_by_id = (req, res, next) => {
    const id = req.params.id;
    Community.find({
            communityId: id,
            communityIsDeleted: false,
        })
        .exec()
        .then(com => {
            if (com.length === 0) {
                return res.status(200).json({
                    count: 0,
                    message: "Community not found or id not valid!"
                })
            } else {
                res.status(200).json({
                    count: com.length,
                    community: com
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err
            });
        });
};
