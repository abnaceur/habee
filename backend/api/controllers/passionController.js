const express = require('express');
const User = require('../models/user');
const Passion = require('../models/passion');
const mongoose = require('mongoose');
const jwt = require ('jsonwebtoken');

exports.get_all_passions = (req, res, next) => {
    Passion.find()
        .exec()
        .then(passions => {
            if (passions.length === 0) {
                return res.status(404).json({
                    message: "There are no passion!"
                })
            } else {
                res.status(200).json({
                    Count: passions.length,
                    passions: passions.map(passion => {
                        return {
                            _id: passion._id,
                            passionId: passion.passionId,
                            passionForCommunity: passion.passionForCommunity,
                            passionName: passion.passionName,
                            subPassions: passion.subPassions,
                            subPassionId: passion.subPassionId,
                            subPassionForCommunity: passion.subPassionForCommunity,
                            subPassionName: passion.subPassionName,
                            passionImage: passion.passionImage,
                            subPassionCategory: passion.subPassionCategory,
                            subPassionImage: passion.subPassionImage,
                            request: {
                                Type: "[GET]",
                                Url: "http://si.habee.local:3000/passions/" + passion.passionId
                            }
                        }
                    })
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.get_subPassion_by_communityId = (req, res, next) => {
    const communityId = req.params.communityId;
    const subPassionId = req.params.subpassionId;

    Passion.find({
        passionForCommunity: communityId,
    })
    .exec()
    .then(pass => {
        if (pass.length === 0) {
            return res.status(404).json({
                message: "passion by communityId not found or id not valid!"
            })
        } else {
            Object.entries(pass).forEach(
                ([key, value]) => {
                    nbSubPassion = value.subPassions.length - 1;
                    while (nbSubPassion >= 0) {
                        if (value.subPassions[nbSubPassion]['subPassionForCommunity'] !== communityId) {
                            delete value.subPassions[nbSubPassion];
                        } else  if (value.subPassions[nbSubPassion]['subPassionId'] !== subPassionId) {
                            delete value.subPassions[nbSubPassion];
                        }
                        nbSubPassion--;
                    }
                }
            );
            res.status(200).json({
                passion: pass[0].subPassions,
                request: {
                    type: "[GET]",
                    url: "http://si.habee.local:3000/passions"
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            Error: err
        });
    });
    console.log('test request');
}


exports.get_passion_by_communityId = (req, res, next) => {
    const id = req.params.id;
    Passion.find({
            passionForCommunity: id
        })
        .exec()
        .then(pass => {
            if (pass.length === 0) {
                return res.status(404).json({
                    message: "passion by communityId not found or id not valid!"
                })
            } else {
                res.status(200).json({
                    passion: pass,
                    request: {
                        type: "[GET]",
                        url: "http://si.habee.local:3000/passions"
                    }
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

exports.get_passion_by_id = (req, res, next) => {
    const id = req.params.id;
    Passion.find({
            passionId: id
        })
        .exec()
        .then(pass => {
            if (pass.length === 0) {
                return res.status(404).json({
                    message: "Passion not found or id not valid!"
                })
            } else {
                res.status(200).json({
                    passion: pass,
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


exports.post_passion = (req, res, next) => {
    const passion = new Passion({
        _id: new mongoose.Types.ObjectId,
        passionId: req.body.passionId,
        passionForCommunity: req.body.passionForCommunity,
        passionName: req.body.passionName,
        //passionImage: req.files['passionImage'][0]['path'] ? req.files['passionImage'][0]['path'] : null,
        subPassions: req.body.subPassions,
        subPassionId: req.body.subPassionId,
        subPassionForCommunity: req.body.subPassionCategory,
        subPassionName: req.body.subPassionName,
        subPassionCategory: req.body.subPassionCategory,
        //subPassionImage: req.files['subPassionImage'][0]['path'] ? req.files['subPassionImage'][0]['path'] : null,
    });
    passion
        .save()
        .then(result => {
            res.status(200).json({
                passion: result
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
};

exports.patch_passion = (req, res, next) => {
    const id = req.params.id;

    Passion.update({
            passionId: id
        }, {
            $set: {
                passionId: req.body.passionId,
                passionForCommunity: req.body.passionForCommunity,
                passionName: req.body.passionName,
                //       passionImage: req.files.path,
                subPassions: req.body.subPassions,
                subPassionId: req.body.subPassionId,
                  subPassionForCommunity: req.body.subPassionCategory,
                subPassionName: req.body.subPassionName,
                subPassionCategory: req.body.subPassionCategory,
                //         subPassionImage: req.files.path,
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
