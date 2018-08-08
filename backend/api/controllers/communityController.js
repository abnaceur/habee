const express = require('express');
const Community = require('../models/community');
const mongoose = require('mongoose');
const jwt = require ('jsonwebtoken');

exports.get_all_communities = (req, res, next) => {
    let nb = 0;

    Community.count().exec()
        .then(count => {
            nb = count;
        });
    //TODO nbrOfUsers
    Community.find()
        //TODO nbrOfUsers
        .select("communityId communityName dateOfCreation dateOfLastUpdate communityIsActive")
        .exec()
        .then(communities => {
            if (communities.length === 0) {
                return res.status(404).json({
                    message: "There are no communities!"
                })
            } else {
                res.status(200).json({
                    nbrCommunities: nb,
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

exports.post_community =  (req, res, next) => {
    const community = new Community({
        _id: new mongoose.Types.ObjectId,
        communityId: req.body.communityId,
        communityName: req.body.communityName,
        //communityLogo: req.file.path,
        communityAdmin: req.body.communityAdmin,
        communityMembers: req.body.communityMembers,
        companyName: req.body.companyName,
        clientId: req.body.clientId,
        communityIsActive: req.body.communityIsActive
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
                return res.status(404).json({
                    message: "Community not found or id not valid!"
                })
            } else {
                res.status(200).json({
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