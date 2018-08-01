const express = require('express');
const router = express.Router();
const Community = require('../models/community');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
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
    fileFilter : fileFilter
});

/*
** API [GET] [POST] for route /communites
*/

router.get('/', (req, res, next) => {
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
                message: "Communities not found!"
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
});


router.post('/', upload.single('communityLogo'), (req, res, next) => {
    console.log('Response: ', req.file);
    const community = new Community({
        _id : new mongoose.Types.ObjectId,
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
    });
    community
    .save()
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        res.status(500).json({
            Error: err
        })
    });
});


/*
** API route [GET] for /communities/active
*/

router.get('/active', (req, res, next) => {
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
});

/* 
** API route [GET] for /communities/isNotActive
*/


router.get('/isNotActive', (req, res, next) => {
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
});

/*
** API routes [GET] [DELETE] [PATCH] for /communities/id
*/

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
     Community.find({
        communityId: id
    })
    .exec()
    .then(com => {
        if (com.length === 0) {
            return res.status(404).json({
                message: "Community not found!"
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
});

router.patch('/:id',upload.single('communityLogo'), (req, res, next) => {
    const id = req.params.id;
    
    Community.update(
        {communityId: id },
        {$set: 
            {
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
        req.status(200).json({
            success: results
        })
    })
    .catch(err => {
        req.status(500).json({
            Error: err
        })
    });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Community.remove({
        communityId: id
    })
    .exec()
    .then(results => {
        res.status(200).json(results);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;