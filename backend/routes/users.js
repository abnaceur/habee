const express = require('express');
const router = express.Router();
const User = require('../models/user');
const community = require('../models/community');
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
 ** API [GET] [POST] for route /users
 */


router.post('/', upload.single('profilePhoto'), (req, res, next) => {
    // Get community id

    const user = new User({
        _id: new mongoose.Types.ObjectId,
        userId: req.body.userId,
        credentials: req.body.credentials,
        username: req.body.username,
        firstname: req.body.firstname,
        birthDate: req.body.birthDate,
        address: req.body.address,
        mail: req.body.mail,
        phone: req.body.phone,
        password: req.body.password,

        communities: req.body.communities,
        profile: req.body.profile,
        profileCummunityId: req.body.profileCummunityId,
        //  profilePhoto: req.file.path,
        profileUsername: req.body.profileUsername,
        profileIsAdmin: req.body.profileIsAdmin,
        profileUserIsActive: req.body.profileUserIsActove,

        passions: req.body.passions,
        skills: req.body.skills,
        currentEvents: req.body.currentEvents,
        eventsICreated: req.body.eventsICreated,
        eventsIParticipate: req.body.eventsIParticipate,
        parameters: req.body.parameters,
        passedEvents: req.body.passedEvents,
        PassedevenementsICreated: req.body.passedEvents,
        PassedEvenementsParticipated: req.body.PassedEvenementsParticipated,
    });
    user
        .save()
        .then(result => {
            res.status(200).json({
                message: "User added with success!",
                Result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
});

router.get('/', (req, res, next) => {
    let nb = 0;

    User.count().exec()
        .then(count => {
            nb = count;
        });
    User.find()
        .select("userId dateOfCreaton communities skills passions")
        .exec()
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({
                    message: "There are no users !"
                })
            } else {
                res.status(200).json({
                    nbrUsers: nb,
                    Users: users
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
 ** API [GET] for route /users/active
 */

router.get('/active', (req, res, next) => {
    let nb = 0;

    User.count().exec()
        .then(count => {
            nb = count;
        });
    User.find({
            "profile.profileUserIsActive": true
        })
        .select("userId dateOfCreaton communities skills passions")
        .exec()
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({
                    message: "There are no active users !"
                })
            } else {
                res.status(200).json({
                    nbrUsers: nb,
                    Users: users
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
 ** API [GET] for route /users/isNotActive
 */

router.get('/isNotActive', (req, res, next) => {
    let nb = 0;

    User.count().exec()
        .then(count => {
            nb = count;
        });
    User.find({
            "profile.profileUserIsActive": false
        })
        .select("userId dateOfCreaton communities skills passions")
        .exec()
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({
                    message: "There are no deactive users !"
                })
            } else {
                res.status(200).json({
                    nbrUsers: nb,
                    Users: users
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
 ** API [GET] for route /users/administrators
 */

router.get('/administrators', (req, res, next) => {
    let nb = 0;

    User.count().exec()
        .then(count => {
            nb = count;
        });
    User.find({
            "profile.profileIsAdmin": 1
        })
        .select("userId dateOfCreaton communities skills passions")
        .exec()
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({
                    message: "There are no administrators !"
                })
            } else {
                res.status(200).json({
                    nbrUsers: nb,
                    Users: users
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
 ** API [GET] for route /users/notAdmin
 */

router.get('/notAdmin', (req, res, next) => {
    let nb = 0;

    User.count().exec()
        .then(count => {
            nb = count;
        });
    User.find({
            "profile.profileIsAdmin": 0
        })
        .select("userId dateOfCreaton communities skills passions")
        .exec()
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({
                    message: "There are no none admin users !"
                })
            } else {
                res.status(200).json({
                    nbrUsers: nb,
                    Users: users
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
 **  API [GET] for route /user/:id
 */

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    User.find({
            userId: id
        })
        .exec()
        .then(usr => {
            if (usr.length === 0) {
                return res.status(404).json({
                    message: "User not found or id not valid!"
                })
            } else {
                res.status(200).json({
                    User: usr
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

/*
 **  API [PATCH] for route /user/:id
 */

router.patch('/:id', upload.single('profilePhoto'), (req, res, next) => {
    const id = req.params.id;

    User.update({
            userId: id
        }, {
            $set: {
                userId: req.body.userId,
                credentials: req.body.credentials,
                username: req.body.username,
                firstname: req.body.firstname,
                birthDate: req.body.birthDate,
                address: req.body.address,
                mail: req.body.mail,
                phone: req.body.phone,
                password: req.body.password,

                communities: req.body.communities,
                profile: req.body.profile,
                profileCummunityId: req.body.profileCummunityId,
                // profilePhoto: req.file.path,
                profileUsername: req.body.profileUsername,
                profileIsAdmin: req.body.profileIsAdmin,
                profileUserIsActive: req.body.profileUserIsActove,

                passions: req.body.passions,
                skills: req.body.skills,
                currentEvents: req.body.currentEvents,
                eventsICreated: req.body.eventsICreated,
                eventsIParticipate: req.body.eventsIParticipate,
                parameters: req.body.parameters,
                passedEvents: req.body.passedEvents,
                PassedevenementsICreated: req.body.passedEvents,
                PassedEvenementsParticipated: req.body.PassedEvenementsParticipated,
            }
        })
        .exec()
        .then(updatedUser => {
            res.status(200).json({
                Success: updatedUser
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
});


/*
 ** API [GET] for route /users/id/credentials 
 */

router.get('/:id/credentials', (req, res, next) => {
    const id = req.params.id;
    User.find({
            userId: id
        })
        .select("userId dateOfCreaton dateOfLastUpdate dateOfCreation credentials ")
        .exec()
        .then(usr => {
            if (usr.length === 0) {
                return res.status(404).json({
                    message: "User not found or id not valid!"
                })
            } else {
                res.status(200).json({
                    User: usr
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

/*
 * API [PATCH] for route /users/id/credentials 
 */

router.patch('/:id/credentials', (req, res, next) => {
    const id = req.params.id;

    User.update({
            userId: id
        }, {
            $set: {
                userId: req.body.userId,
                credentials: req.body.credentials,
                username: req.body.username,
                firstname: req.body.firstname,
                birthDate: req.body.birthDate,
                address: req.body.address,
                mail: req.body.mail,
                phone: req.body.phone,
                password: req.body.password,
            }
        })
        .exec()
        .then(updatedUser => {
            res.status(200).json({
                Success: updatedUser
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
});

/*
 ** API [GET] for route /users/id/communityId   
 */

router.get('/:id/:communityId', (req, res, next) => {
    const id = req.params.id;
    const communityId = req.params.communityId;
    let nbProfile = 0;

    community.count().exec()
        .then(count => {
            nbProfile = count;
        });

    User.find({
            userId: id
        })
        .exec()
        .then(usrs => {
            if (usrs.length === 0) {
                return res.status(404).json({
                    message: "User not found or id not valid!"
                })
            } else {
                Object.entries(usrs).forEach(
                    ([key, value]) => {
                        nbProfile = value.profile.length - 1;
                        while (nbProfile >= 0) {
                            if (value.profile[nbProfile]['profileCummunityId'] !== communityId) {
                                delete value.profile[nbProfile];
                            }
                            nbProfile--;
                        }
                    }
                );
                res.status(200).json({
                    User: usrs
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

/*
 ** API [PATCH] for route /users/id/communityId   
 */

router.patch('/:id/:communityId', (req, res, next) => {
    const id = req.params.id;
    const communityId = req.params.communityId;
    User.find({
        userId: id,
        "profile.profileCummunityId": communityId
    })

    User.update({
            userId: id
        }, {
            $set: {
                userId: req.body.userId,
                credentials: req.body.credentials,
                username: req.body.username,
                firstname: req.body.firstname,
                birthDate: req.body.birthDate,
                address: req.body.address,
                mail: req.body.mail,
                phone: req.body.phone,
                password: req.body.password,

                communities: req.body.communities,
                profile: req.body.profile,
                profileCummunityId: req.body.profileCummunityId,
                // profilePhoto: req.file.path,
                profileUsername: req.body.profileUsername,
                profileIsAdmin: req.body.profileIsAdmin,
                profileUserIsActive: req.body.profileUserIsActove,

                passions: req.body.passions,
                skills: req.body.skills,
                currentEvents: req.body.currentEvents,
                eventsICreated: req.body.eventsICreated,
                eventsIParticipate: req.body.eventsIParticipate,
                parameters: req.body.parameters,
                passedEvents: req.body.passedEvents,
                PassedevenementsICreated: req.body.passedEvents,
                PassedEvenementsParticipated: req.body.PassedEvenementsParticipated,

            }
        })
        .exec()
        .then(updatedUser => {
            res.status(200).json({
                Success: updatedUser
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });
});





module.exports = router;