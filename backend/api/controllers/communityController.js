const express = require('express');
const Community = require('../models/community');
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const utils = require('../services/utils');

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

    console.log(userId, communityId);

    User.find({
            userId: userId
        })
        .exec()
        .then(usr => {
            usr[0].activeCommunity = communityId;
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

    let imagePath;

    // TODO UNDRY THIS
    if (req.body.photo != undefined)
        imagePath = req.body.photo;
    else if (req.files == undefined)
        imagePath = "uploads/defaultEventImage.jpeg"
    else if (req.files != undefined)
        imagePath = req.files[0].path;


    Community.find({
            communityName: req.body.communityName
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
                                    }, function (err, results) {
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

    console.log("Body community : ", req.body, userId)
    Community.find({
            communityCreator: userId
        })
        .exec()
        .then(coms =>
            res.status(200).json({
                communities: coms
            })
        ).catch(err => {
            res.status(500).json({
                Error: err
            })
        })

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

exports.get_all_active_communities = (req, res, next) => {
    Community.find({
            communityIsActive: true
        })
        .select("communityId communityName dateOfCreation dateOfLastUpdate communityIsActive")
        .exec()
        .then(activeCom => {
            if (activeCom.length === 0) {
                return res.status(404).json({
                    code: "101",
                    message: "There are no active communities!"
                })
            } else {
                res.status(200).json({
                    Communities: activeCom
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.get_all_notActive_communities = (req, res, next) => {
    Community.find({
            communityIsActive: false
        })
        .select("communityId communityName dateOfCreation dateOfLastUpdate communityIsActive")
        .exec()
        .then(isNOtActiveCom => {
            if (isNOtActiveCom.length === 0) {
                return res.status(404).json({
                    message: "There are no deactivated communities!"
                })
            } else {
                res.status(200).json({
                    Communities: isNOtActiveCom
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.get_community_by_id = (req, res, next) => {
    const id = req.params.id;
    Community.find({
            communityId: id
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

exports.patch_community_by_id = (req, res, next) => {
    const id = req.params.id;

    Community.update({
            communityId: id
        }, {
            $set: {
                communityId: req.body.communityId,
                communityName: req.body.communityName,
                communityLogo: req.file.path,
                communityAdmin: req.body.communityAdmin,
                communityMembers: req.body.communityMembers,
                dateOfCreation: req.body.dateOfCreation,
                dateOfLastUpdate: req.body.dateOfLastUpdate,
                companyName: req.body.companyName,
                clientId: req.body.clientId,
                communityIsActive: req.body.communityIsActive
            }
        })
        .exec()
        .then(results => {
            res.status(200).json({
                success: results
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
};