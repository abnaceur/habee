const express = require('express');
const router = express.Router();
const Skill = require('../models/skill');
const mongoose = require('mongoose');
const multer = require('multer');

exports.get_all_skills = (req, res, next) => {
    Skill.find()
        .exec()
        .then(skills => {
            if (skills.length === 0) {
                return res.status(404).json({
                    message: "There are no skills!"
                })
            } else {
                res.status(200).json({
                    Count: skills.length,
                    skills: skills.map(skl => {
                        return {
                            _id: skl._id,
                            skillId: skl.skillId,
                            skillForCommunity: skl.skillForCommunity,
                            skillName: skl.skillName,
                            // skillImage: skl.skillImage,
                            skillMastery: skl.skillMastery,
                            request: {
                                Type: "[GET]",
                                Url: "http://si.habee.local:3000/skills/" + skl.skillId
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

exports.post_skill = (req, res, next) => {
    const skill = new Skill({
        _id: new mongoose.Types.ObjectId,
        skillId: req.body.skillId,
        skillForCommunity: req.body.skillForCommunity,
        skillName: req.body.skillName,
        // skillImage: req.files.path,
        skillMastery: req.body.skillMastery,
    });
    skill
        .save()
        .then(result => {
            res.status(200).json({
                skill: result
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
};

exports.get_skill_by_communityId = (req, res, next) => {
    const id = req.params.id;
    Skill.find({
            skillForCommunity: id
        })
        .exec()
        .then(skl => {
            if (skl.length === 0) {
                return res.status(404).json({
                    message: "Skill by communityId not found or id not valid!"
                })
            } else {
                res.status(200).json({
                    Skill: skl,
                    request: {
                        type: "[GET]",
                        url: "http://si.habee.local:3000/skills"
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

exports.get_skill_by_id = (req, res, next) => {
    const id = req.params.id;
    Skill.find({
            skillId: id
        })
        .exec()
        .then(skl => {
            if (skl.length === 0) {
                return res.status(404).json({
                    message: "Skill not found or id not valid!"
                })
            } else {
                res.status(200).json({
                    Skill: skl,
                    request: {
                        type: "[GET]",
                        url: "http://si.habee.local:3000/skills"
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

exports.patch_skill = (req, res, next) => {
    const id = req.params.id;

    Skill.update({
            skillId: id
        }, {
            $set: {
                skillId: req.body.skillId,
                skillForCommunity: req.body.skillForCommunity,
                skillName: req.body.skillName,
                // skillImage: req.files.path,
                skillMastery: req.body.skillMastery,
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