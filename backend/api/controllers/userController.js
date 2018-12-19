const express = require('express');
const User = require('../models/user');
const Community = require('../models/community');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Event = require('../models/event');
const utils = require('../services/utils');

exports.login_user = (req, res, next) => {
    User.find({
            "credentials.email": req.body.credentials.email
        })
        .exec()
        .then(users => {

            if (users.length === 0) {
                return res.status(200).json({
                    message: "Auth failed",
                    code: "404"
                })
            } else {
                if (bcrypt.compareSync(req.body.credentials.password, users[0].credentials.password) == true) {
                    const token = jwt.sign({
                        id: req.body.userId,
                        email: req.body.credentials.email
                    }, process.env.JWT_KEY, {
                        expiresIn: process.env.TOKEN_DURATION
                    })
                    res.status(200).json({
                        message: "Auth success",
                        code: "200",
                        userId: users[0].userId,
                        activeCommunity: users[0].activeCommunity,
                        firstConnection: users[0].firstConnection,
                        token: token
                    })
                } else {
                    res.status(200).json({
                        message: "Auth failed",
                        code: "409",
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

exports.updateUserByfirstConnection = (req, res, next) => {
    let userId = req.params.userId;
    console.log("userId ", userId);
    User.find({
            userId: userId
        })
        .exec()
        .then(usr => {
            console.log("User : ", usr)
            req.body.firstConnection = usr[0].firstConnection + 1;
            console.log("Req body", req.body);
            User.findByIdAndUpdate(usr[0]._id,
                req.body, {
                    new: false,
                },
                function (err, results) {
                    if (err) return res.status(500).json(err);
                    res.status(200).json({
                        results: true
                    })
                });
        })
        .catch(err => {
            res.status(500).json({
                results: false,
                Error: err
            })
        })
}

exports.getAllusersByCommunityId = (req, res, next) => {
    let communityId = req.params.communityId;
    User.find({
            "profile.profileCummunityId": communityId,
            "profile.profileUserIsDeleted": false,
        })
        .exec()
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({
                    message: "There are no users !"
                })
            } else {
                res.status(200).json({
                    users: users.map(usr => {
                        return {
                            userId: usr.userId,
                            firstname: usr.credentials.firstname,
                            lastname: usr.credentials.lastname,
                            email: usr.credentials.email,
                            profileIsActive: usr.profile[0].profileUserIsActive,
                            profileRole: usr.profile[0].profileIsAdmin,
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
}


exports.getAllusersByCommunityIdMobile = (req, res, next) => {
    let communityId = req.params.communityId;
    User.find({
            "profile.profileCummunityId": communityId,
            "profile.profileUserIsDeleted": false,
            "profile.profileUserIsActive": true,
        })
        .exec()
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({
                    message: "There are no users !"
                })
            } else {
                res.status(200).json({
                    users: users.map(usr => {
                        return {
                            userId: usr.userId,
                            profileUsername: usr.profile[0].profileUsername,
                            profilePhoto: usr.profile[0].profilePhoto,
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
}


exports.post_userMobile = (req, res, next) => {
    console.log("Post mobile user: ", req.body)
    console.log("Post mobile user file : ", req.file)

    let imagePathprofilePhoto;
    let imagePathcommunityLogo;

    // TODO UNDRY THIS
    if (req.body.communityLogo != undefined)
        imagePathcommunityLogo = req.body.imagePathcommunityLogo;
    else if (req.files == undefined)
        imagePathcommunityLogo = "uploads/defaultEventImage.jpeg"
    else if (req.files != undefined)
        imagePathcommunityLogo = req.files[0].path;


    if (req.body.profilePhoto != undefined)
        imagePathprofilePhoto = req.body.profilePhoto;
    else if (req.files == undefined)
        imagePathprofilePhoto = "uploads/defaultEventImage.jpeg"
    else if (req.files != undefined)
        imagePathprofilePhoto = req.files[0].path;


    console.log("imagePath : ", imagePathprofilePhoto, imagePathcommunityLogo);


    User.find({
            "credentials.email": req.body.email
        })
        .exec()
        .then(usr => {
            if (usr.length > 0) {
                return res.status(409).json({
                    Message: "Email exists!"
                })
            } else {
                Community.find({
                    communityId: req.body.activeCommunity
                }).then(com => {
                    if (com.length > 0) {
                        return res.status(409).json({
                            Message: "Community exists!"
                        })
                    } else {
                        //TOFO RANDOM UNIQUE ID
                        const community = new Community({
                            _id: new mongoose.Types.ObjectId,
                            communityId: req.body.activeCommunity,
                            communityName: req.body.activeCommunity,
                            communityLogo: imagePathcommunityLogo,
                            communityCreator: req.body.userId,
                            communityMembers: [req.body.userId],
                            communityIsActive: true
                        });
                        community
                            .save()
                            .then(com => {
                                let pass = req.body.password;
                                bcrypt.hash(req.body.password, 10, (err, hash) => {
                                    if (err) {
                                        return res.status(500).json({
                                            Error: err
                                        })
                                    } else {
                                        const user = new User({
                                            _id: new mongoose.Types.ObjectId,
                                            userId: req.body.userId,
                                            activeCommunity: req.body.activeCommunity,
                                            activeProfileRole: req.body.profileIsAdmin,
                                            credentials: {
                                                firstname: req.body.firstname,
                                                lastname: req.body.lastname,
                                                birthDate: req.body.birthDate,
                                                address: req.body.address,
                                                email: req.body.email,
                                                phone: req.body.phone,
                                                password: hash,
                                            },

                                            communities: req.body.communities,
                                            profile: [{
                                                profileCummunityId: req.body.profileCummunityId,
                                                profilePhoto: imagePathcommunityLogo,
                                                profileUsername: req.body.profileUsername,
                                                profileIsAdmin: req.body.profileIsAdmin,
                                                profileUserIsActive: req.body.profileUserIsActive,
                                                profileUserIsDeleted: req.body.profileUserIsDeleted ? req.body.profileUserIsDeleted : false,
                                            }],
                                            filterEvent: [{
                                                filterCommunity: req.body.activeCommunity,
                                                SportValue: false,
                                                ArtsValue: false,
                                                cultureValue: false,
                                                MediaValue: false,
                                                musicValue: false,
                                                socialValue: false,
                                                internValue: false,
                                                businessValue: false,
                                                communityValue: false,
                                                santeValue: false,
                                                itValue: false,
                                                lifestyleValue: false,
                                                partyValue: false,
                                                meetingValue: false,
                                                WorkshopValue: false,
                                            }],
                                            passions: req.body.passions,
                                            skills: req.body.skills,
                                            currentEvents: req.body.currentEvents,
                                            "currentEvents.eventsICreated": req.body.eventsICreated,
                                            "currentEvents.eventsIParticipate": req.body.eventsIParticipate,
                                            parameters: req.body.parameters,
                                            passedEvents: req.body.passedEvents,
                                            "passedEvents.PassedevenementsICreated": req.body.passedEvents,
                                            "passedEvents.PassedEvenementsParticipated": req.body.PassedEvenementsParticipated,
                                        });
                                        user
                                            .save()
                                            .then(result => {
                                                console.log("User this: ", result)
                                                let emailNew = result.credentials.email;

                                                let text = "Hello ! \n Vous avez recu une invitaion pour rejoindre la communitee [nom de la communitee] \
                                            \n voila vos logins : \n Email : " + emailNew + "\n Mot de pass : " + pass + "\
                                            \n P.S : Ce mot de pass est genere autoatiquement, vouos devez change votre de pass depuis l'app HABEE \
                                            \n TEAM HABEE"


                                                utils.sendEmail("Habee TEAM", emailNew, "Bienvenu nouveau Habeebebois !", text);
                                                res.status(200).json({
                                                    message: "User added with success!"
                                                    // Resulta: result
                                                })
                                            })
                                            .catch(err => {
                                                res.status(500).json({
                                                    Error: err
                                                })
                                            });
                                    }
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    Error: err
                                })
                            });
                    }
                })
            }
        })
}


exports.post_user = (req, res, next) => {
    console.log("File : ", req.file);
    User.find({
            "credentials.email": req.body.email
        })
        .exec()
        .then(usr => {
            if (usr.length > 0) {
                return res.status(409).json({
                    Message: "Email exists!"
                })
            } else {
                let pass = req.body.password;
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            Error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            userId: req.body.userId,
                            activeCommunity: req.body.activeCommunity,
                            activeProfileRole: req.body.profileIsAdmin,
                            credentials: {
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                birthDate: req.body.birthDate,
                                address: req.body.address,
                                email: req.body.email,
                                phone: req.body.phone,
                                password: hash,
                            },

                            communities: req.body.communities,
                            profile: [{
                                profileCummunityId: req.body.profileCummunityId,
                                profilePhoto: req.file == undefined ? "uplaods/" : req.file.path,
                                profileUsername: req.body.profileUsername,
                                profileIsAdmin: req.body.profileIsAdmin,
                                profileUserIsActive: req.body.profileUserIsActive,
                                profileUserIsDeleted: req.body.profileUserIsDeleted ? req.body.profileUserIsDeleted : false,
                            }],
                            filterEvent: [{
                                filterCommunity: req.body.profileCummunityId,
                                SportValue: false,
                                ArtsValue: false,
                                cultureValue: false,
                                MediaValue: false,
                                musicValue: false,
                                socialValue: false,
                                internValue: false,
                                businessValue: false,
                                communityValue: false,
                                santeValue: false,
                                itValue: false,
                                lifestyleValue: false,
                                partyValue: false,
                                meetingValue: false,
                                WorkshopValue: false,
                            }],
                            passions: req.body.passions,
                            skills: req.body.skills,
                            currentEvents: req.body.currentEvents,
                            "currentEvents.eventsICreated": req.body.eventsICreated,
                            "currentEvents.eventsIParticipate": req.body.eventsIParticipate,
                            parameters: req.body.parameters,
                            passedEvents: req.body.passedEvents,
                            "passedEvents.PassedevenementsICreated": req.body.passedEvents,
                            "passedEvents.PassedEvenementsParticipated": req.body.PassedEvenementsParticipated,
                        });
                        user
                            .save()
                            .then(result => {
                                console.log("User this: ", result)
                                let emailNew = result.credentials.email;

                                let text = "Hello ! \n Vous avez recu une invitaion pour rejoindre la communitee [nom de la communitee] \
                                \n voila vos logins : \n Email : " + emailNew + "\n Mot de pass : " + pass + "\
                                \n P.S : Ce mot de pass est genere autoatiquement, vouos devez change votre de pass depuis l'app HABEE \
                                \n TEAM HABEE"


                                utils.sendEmail("Habee TEAM", emailNew, "Bienvenu nouveau Habeebebois !", text);
                                res.status(200).json({
                                    message: "User added with success!"
                                    // Resulta: result
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    Error: err
                                })
                            });
                    }
                });

            }
        })



};

exports.get_all_users = (req, res, next) => {
    let nb = 0;

    User.count().exec()
        .then(count => {
            nb = count;
        });
    User.find()
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

exports.get_all_notActive_users = (req, res, next) => {
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

exports.get_all_admins = (req, res, next) => {
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

exports.get_user_by_id = (req, res, next) => {
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
                if (usr[0].eventsParticipated.length != 0) {
                    Event.find({
                            eventCommunity: usr[0].eventsParticipated[0].eventCommunity,
                            eventIsOver: false,
                            eventIsDeleted: false,
                        }).exec()
                        .then(event => {
                            let allUserEvents = [];
                            let i = 0;
                            let z = 0;

                            while (i < usr[0].eventsParticipated.length) {
                                while (z < event.length) {
                                    if (usr[0].eventsParticipated[i].eventId == event[z].eventId) {
                                        allUserEvents.push(event[z]);
                                    }
                                    z++;
                                }
                                z = 0;
                                i++;
                            }
                            console.log("test : ", allUserEvents)
                            usr[0].eventsParticipated = allUserEvents;

                            res.status(200).json({
                                User: usr
                            });
                        })
                } else {
                    res.status(200).json({
                        User: usr
                    });
                }
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
    if (req.body.credentials.password === undefined) {
        User.find({
                userId: id
            })
            .update(req.body)
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

    } else {
        bcrypt.hash(req.body.credentials.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    Error: err
                })
            } else {
                if (req.body.credentials.password)
                    req.body.credentials.password = hash;
                User.find({
                        userId: id
                    })
                    .update(req.body)
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
            }
        });
    }
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

    bcrypt.hash(req.body.credentials.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                Error: err
            })
        } else {
            if (req.body.credentials.password)
                req.body.credentials.password = hash;
            User.find({
                    userId: id
                })
                .update(req.body)
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
        }
    });

};

exports.get_userId_communityId = (req, res, next) => {
    const id = req.params.id;
    const communityId = req.params.communityId;
    let nbProfile = 0;
    console.log("here ");
    Community.count().exec()
        .then(count => {
            nbProfile = count;
        });

    User.find({
            userId: id,
        })
        .exec()
        .then(usrs => {
            // console.log(usrs);
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
                if (usrs[0].eventsParticipated.length != 0) {
                    Event.find({
                            eventCommunity: usrs[0].eventsParticipated[0].eventCommunity,
                            eventIsDeleted: false,
                        }).exec()
                        .then(event => {
                            let allUserEvents = [];
                            let i = 0;
                            let z = 0;

                            while (i < usrs[0].eventsParticipated.length) {
                                while (z < event.length) {
                                    if (usrs[0].eventsParticipated[i].eventId == event[z].eventId) {
                                        allUserEvents.push(event[z]);
                                    }
                                    z++;
                                }
                                z = 0;
                                i++;
                            }
                            console.log("test : ", allUserEvents)
                            usrs[0].eventsParticipated = allUserEvents;

                            Event.find({
                                    eventCreator: id,
                                    eventIsDeleted: false,
                                }).exec()
                                .then(event => {
                                    res.status(200).json({
                                        Users: usrs.map(usr => {
                                            return {
                                                eventCreated: event.length,
                                                userId: usr.userId,
                                                profile: usr.profile,
                                                profileRole: usr.profile[0].profileIsAdmin,
                                                nbrEventsParticipated: usr.eventsParticipated.length,
                                                profileIsActive: usr.profile[0].profileUserIsActive,
                                                profileRole: usr.profile[0].profileIsAdmin,
                                            }
                                        })
                                    });
                                })

                        })
                } else {
                    Event.find({
                            eventCreator: id,
                            eventIsDeleted: false,
                        }).exec()
                        .then(event => {
                            res.status(200).json({
                                Users: usrs.map(usr => {
                                    return {
                                        eventCreated: event.length,
                                        userId: usr.userId,
                                        profile: usr.profile,
                                        profileRole: usr.profile[0].profileIsAdmin,
                                        nbrEventsParticipated: usr.eventsParticipated.length,
                                        profileIsActive: usr.profile[0].profileUserIsActive,
                                        profileRole: usr.profile[0].profileIsAdmin,
                                    }
                                })
                            });
                        })
                }
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err
            });
        });
};


exports.put_userId_communityId_EditUser = (req, res, next) => {
    const id = req.params.id;
    const communityId = req.params.communityId;
    User.find({
            userId: id,
            "profile.profileCummunityId": communityId
        }).exec()
        .then(usr => {
            req.body.credentials.password = usr[0].credentials.password;
            req.body.credentials.birthDate = usr[0].credentials.birthDate,
                req.body.credentials.address = usr[0].credentials.address,
                req.body.credentials.phone = usr[0].credentials.phone,
                User.findByIdAndUpdate(usr[0]._id,
                    req.body, {
                        new: false,
                    },
                    function (err, results) {
                        if (err) return res.status(500).json(err);
                        res.send(results);
                    });
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });

};


exports.put_userId_communityId_DeleteUser = (req, res, next) => {
    const id = req.params.id;
    const communityId = req.params.communityId;
    User.find({
            userId: id,
            "profile.profileCummunityId": communityId
        }).exec()
        .then(usr => {
            User.findByIdAndUpdate(usr[0]._id,
                req.body, {
                    new: false,
                },
                function (err, results) {
                    if (err) return res.status(500).json(err);
                    res.send(results);
                });
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });

};

exports.get_skills_by_userId_communityId = (req, res, next) => {
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