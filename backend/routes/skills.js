const express = require('express');
const router = express.Router();
const Skill = require('../models/skill');
const mongoose = require('mongoose');
const multer = require('multer');

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
 * API [GET] for route /skills 
 */

router.get('/', (req, res, next) => {
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
                    passions: skills.map(skl => {
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
});



/**
 * API [POST] for route /skills
 */


router.post('/', upload.any(), (req, res, next) => {
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
});



/**
 * API [GET] for route /skills/community/skillForCommunity
 */

router.get('/community/:id', (req, res, next) => {
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
});


/**
 * API [GET] foor route /skills/id
 */

router.get('/:id', (req, res, next) => {
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
});


/**
 *  API [PATCH] for route /skills/communityId
 */


router.patch('/:id', upload.any(), (req, res, next) => {
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
});


module.exports = router;