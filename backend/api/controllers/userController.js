const express = require('express');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require ('jsonwebtoken');

exports.login_user = (req, res, next) => {
    User.find({
        "credentials.email" : req.body.credentials.email   
    })
    .exec()
    .then(users => {
        console.log('password', users[0].credentials.email);
        if (users.length === 0) {
            return res.status(404).json({
                message: "There are no users match this emal!" + req.body.credentials.email
            })
        } else {
            //TODO USE BCRYPT TO COMPARE THE VALIDITY OF THE PASZORD
            if (req.body.credentials.password === users[0].credentials.password)
            {
                const token = jwt.sign({
                    id: req.body.userId,
                    email: req.body.credentials.email
                }, process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
            )
                res.status(200).json({
                    message: "Auth success",
                    token: token
                })
            } else {
                res.status(200).json({
                    message: "Auth failed"
                })
            }
            
    }
    })
    .catch(err => {
        res.status(404).json({
            Error: err
        })
    })
 };

 exports.post_user = (req, res, next) => {
    // Get community id

    const user = new User({
        _id: new mongoose.Types.ObjectId,
        userId: req.body.userId,
        credentials: req.body.credentials,
        username: req.body.username,
        firstname: req.body.firstname,
        birthDate: req.body.birthDate,
        address: req.body.address,
        email: req.body.mail,
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
};

exports.get_all_users =  (req, res, next) => {
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
};

exports.get_all_active_users = (req, res, next) => {
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
};

exports.get_all_notActive_users =  (req, res, next) => {
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
};

exports.get_all_admins =  (req, res, next) => {
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
};

exports.get_all_notAdmins = (req, res, next) => {
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
};

exports.get_user_by_id =  (req, res, next) => {
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
};

exports.patch_user_by_id = (req, res, next) => {
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
                email: req.body.mail,
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
};

exports.get_credentials_by_id = (req, res, next) => {
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
};

exports.patch_credentials_by_id = (req, res, next) => {
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
};

exports.get_userId_communityId =  (req, res, next) => {
    const id = req.params.id;
    const communityId = req.params.communityId;
    let nbProfile = 0;

    community.count().exec()
        .then(count => {
            nbProfile = count;
        });

    User.find({
            userId: id,

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
                    Users: usrs
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


exports.patch_userId_communityId = (req, res, next) => {
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
};

exports.get_skills_by_userId_communityId =  (req, res, next) => {
    const id = req.params.userId;
    const communityId = req.params.communityId;

    User.count({
        userId: id
    }, function (err, count) {
        if (count > 0) {
            Skill.find({
                    skillForCommunity: communityId
                })
                .exec()
                .then(skl => {
                    if (skl.length === 0) {
                        return res.status(404).json({
                            message: "Skill not found or communityId not valid!"
                        })
                    } else {

                        User.find({
                            userId: id,
                
                        })
                        .select("userId dateOfCreation dateOfLastUpdate skills profile")
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
                                let nbSkills = skl.length;
                                let skills = [];
                                while (nbSkills > 0) {
                                    skills.push(skl[nbSkills - 1]['skillId']);
                                    nbSkills--;
                                }
                                usrs[0]['skills'] = skills;
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
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        Error: err
                    });
                });
        } else {
            res.status(404).json({
                Error: "User does not exist!"
            })
        }

    });
};

exports.get_passions_by_userId_communityId = (req, res, next) => {
    const id = req.params.userId;
    const communityId = req.params.communityId;

    User.count({
        userId: id
    }, function (err, count) {
        if (count > 0) {
            Passion.find({
                passionForCommunity: communityId
                })
                .exec()
                .then(pass => {
                    if (pass.length === 0) {
                        return res.status(404).json({
                            message: "Passion not found or communityId not valid!"
                        })
                    } else {

                        User.find({
                            userId: id,
                
                        })
                        .select("userId dateOfCreation dateOfLastUpdate passions profile")
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
                                let nbPassions = pass.length;
                                let passions = [];
                                while (nbPassions > 0) {
                                    passions.push(pass[nbPassions - 1]['passionId']);
                                    nbPassions--;
                                }
                                usrs[0]['passions'] = passions;
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
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        Error: err
                    });
                });
        } else {
            res.status(404).json({
                Error: "User does not exist!"
            })
        }

    });
};