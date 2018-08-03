const express = require('express');
const router = express.Router();
const Passion = require('../models/passion');
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
 * API [GET] for route /passions 
 */

router.get('/', (req, res, next) => {
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
                            subPassionName: passion.subPassionName,
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
});


/**
 * API [GET] foor route /passions/communityId
 */

router.get('/:id', (req, res, next) => {
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
});



/**
 * API [GET] foor route /passions/id
 */

router.get('/:id', (req, res, next) => {
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
});



/**
 * API [POST] for route /passions
 */


router.post('/', upload.any(), (req, res, next) => {
    const passion = new Passion({
        _id: new mongoose.Types.ObjectId,
        passionId: req.body.passionId,
        passionForCommunity: req.body.passionForCommunity,
        passionName: req.body.passionName,
  //      passionImage: req.files.path,
        subPassions: req.body.subPassions,
        subPassionId: req.body.subPassionId,
        subPassionName: req.body.subPassionName,
        subPassionCategory: req.body.subPassionCategory,
//        subPassionImage: req.files.path,
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
});

/**
 *  API [PATCH] for route /passions/id
 */


router.patch('/:id', upload.any(), (req, res, next) => {
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
});


module.exports = router;