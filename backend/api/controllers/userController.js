const User = require('../models/user');
const Community = require('../models/community');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Event = require('../models/event');
const utils = require('../services/utils');
const userService = require('../services/userServices');
const eventService = require('../services/eventService')
const userClass = require('../classes/userClass')
const userEmailsTemplate = require('../emailsTemplate/userEmails');
const getUserByCommunityIdService = require('../services/userServices/getUserbyCommunityIdService')
const pswService = require("../services/userServices/pswService");
const userAccountService = require('../services/userServices/userAccount')
const userInvitationService = require('../services/userServices/userInvitationService');
const userProfileService = require('../services/userServices/getUserProfile')
const pswReset = require('../services/userServices/resetPassword')
const deleteUserAccount = require("../services/userServices/deleteAccount")
const updateNotificationAccount = require("../services/userServices/updateNotification")
const getNotificationStatus = require("../services/userServices/getNotificationStatus")
const getUsrService = require('../services/userServices/getUserById')
const allusersCommunityConcat = require("../services/userServices/allusersCommunityConcatService")
const removeCommunityService = require("../services/userServices/removeCommunityService")
const cancelInvitationService = require("../services/userServices/cancelInvitationService")
const invitationService = require('../services/invitationService/invitationSendToContact');
const invitationQrCodeService = require('../services/invitationService/invitationQrCodeService');

exports.login_user = (req, res, next) => {
    userService.loginUser(req, res);
};

exports.updateUserByfirstConnection = (req, res, next) => {
    userService.updateFirstConnection(req, res);
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
    let page = req.params.page;
    let userId = req.params.userId

    userProfileService.getUserProfileInfo(req, res, page, userId)
}


exports.post_userMobile = (req, res, next) => {

    let imagePathprofilePhoto = userService.getImagePath(req, req.body.profilePhoto);
    let imagePathcommunityLogo = userService.getImagePath(req, req.body.communityLogocommunityLogo);

    User.find({
            "credentials.email": req.body.email
        })
        .exec()
        .then(usr => {
            if (usr.length > 0) {
                return res.status(200).json({
                    Message: "Email exists!"
                })
            } else {
                Community.find({
                    communityId: req.body.activeCommunity
                }).then(com => {
                    if (com.length > 0) {
                        return res.status(200).json({
                            Message: "Community exists!"
                        })
                    } else {
                        //TODO RANDOM UNIQUE ID
                        const community = new Community({
                            _id: new mongoose.Types.ObjectId,
                            communityId: req.body.activeCommunity,
                            communityName: req.body.activeCommunity,
                            communityLogo: imagePathcommunityLogo,
                            communityDescripton: req.body.communityDescripton,
                            communityCreator: req.body.userId,
                            communityMembers: req.body.userId,
                            communityIsActive: true,
                            communityIsDeleted: false
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
                                        const user = new User(userClass.userClassPost(req, hash, imagePathprofilePhoto));
                                        user
                                            .save()
                                            .then(result => {
                                                let msg = userEmailsTemplate.accountCreated(result.credentials.email, pass)
                                                utils.sendEmail("Habee TEAM", result.credentials.email, "Bienvenu nouveau Habeebebois !", msg);

                                                res.status(200).json({
                                                    results: "success",
                                                    message: "User added with success!"
                                                    // Resulta: result
                                                })
                                            })
                                            .catch(err => {
                                                this.utils.defaultError(err)
                                            });
                                    }
                                });
                            })
                            .catch(err => {
                                this.utils.defaultError(err)
                            });
                    }
                })
            }
        })
}



// This is useed for posting from a web applicationn
exports.post_user = (req, res, next) => {

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
                        const user = new User(userClass.userClassPost(req, hash, req.file == undefined ? "uplaods/" : req.file.path));
                        user
                            .save()
                            .then(result => {
                                let msg = userEmailsTemplate.accountCreated(result.credentials.email, pass)
                                utils.sendEmail("Habee TEAM", result.credentials.email, "Bienvenu nouveau Habeebebois !", msg);

                                res.status(200).json({
                                    message: "User added with success!"
                                    // Resulta: result
                                })
                            })
                            .catch(err => {
                                this.utils.defaultError(err)
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

exports.get_user_by_id = (req, res, next) => {
    const id = req.params.id;
    
    getUsrService.getUserById(id, res)   
};


exports.postInvitedContacts = (req, res, next) => {
    let userId = req.params.userId;

    invitationService.addContacts(req.body, userId)
        .then(email => {
            res.status(200).json({
                code: 200,
                msg: email
            })
        })
}

exports.getInvitedByQrCode = (req, res, next) => {
    let userId = req.params.userId;

    invitationQrCodeService.addContactsQrCode(req.body, userId)
        .then(email => {
            res.status(200).json({
                code: 200,
                msg: email
            })
        })
}

exports.get_userId_communityId = (req, res, next) => {
    const id = req.params.id;
    const communityId = req.params.communityId;

    getUserByCommunityIdService.getUserInfo(req, res, id, communityId);
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

exports.creatAnewAccount = (req, res, next) => {
    userService.checkIfEmailExist(req.body.email)
        .then(data => {
            if (data === false) {
                res.status(200).json({
                    code: 201,
                    msg: "Email exist."
                })
            } else {
                userService.createNewAccount(req.body, res)
            }
        })
}

exports.editProfile = (req, res, next) => {
    let userId = req.params.userId;
    let imagePath = utils.getImagePath(req, req.body.profileImage);
    userService.updateProfile(res, imagePath, req.body, userId)
}

exports.checkPsw = (req, res, next) => {
    let userId = req.params.userId;
    pswService.verfiyPsw(res, req.body.oldPassword, userId)
}

exports.updatePsw = (req, res, next) => {
    let userId = req.params.userId;
    pswService.updateThisPsw(res, req.body.newPassword, userId)
}

exports.getAccountInfo = (req, res, next) => {
    let userId = req.params.userId;
    userAccountService.getThisAccountInfo(res, userId)
}

exports.updateAccountInfo = (req, res, next) => {
    let userId = req.params.userId;

    userAccountService.updateThisUserAccount(res, req.body, userId);
}


exports.getListInvitationn = (req, res, next) => {
    let userId = req.params.userId;
    let communityId = req.params.communityId;
    let page = req.params.page;

    userInvitationService.listAllUserInvitation(res, userId, communityId, page)
}

exports.updateInvitationNotification = (req, res, next) => {
    let userId = req.params.userId;
    let communityId = req.params.communityId;

    userInvitationService.updateNotification(res, userId, communityId)
}

exports.countNotificationbyUserId = (req, res, next) => {
    let userId = req.params.userId;
    let communityId = req.params.communityId;

    userInvitationService.updateNotification(res, userId, communityId)
}

exports.statusAccepetedInvitation = (req, res, next) => {
    let userId = req.params.userId;
    let communityId = req.params.communityId;

    userInvitationService.updateInvitationStatus(req.body, userId, res)
}

exports.statusRejectedInvitation = (req, res, next) => {
    let userId = req.params.userId;
   
    userInvitationService.updateInvitationStatus(req.body, userId, res)
}

exports.resetPassword = (req, res, next) => {
    let email = req.params.email;
    pswReset.resetPsw(email, res)
}

exports.deleteUserAccount = (req, res, next) => {
    let userId = req.params.userId;
    deleteUserAccount.deleteThisUserAccount(res, userId)
}

exports.updateNotificationStatus = (req, res, next) => {
    let userId = req.params.userId;
    let notifStatus = req.body.notifStatus;
    
    updateNotificationAccount.updateThisUserNotification(res, userId, notifStatus)
}


exports.getNotificationStatus = (req, res, next) => {
    let userId = req.params.userId;

    getNotificationStatus.getNotificationStatusThisUser(res, userId)
}

exports.getAllusersCommunityConcat = (req, res, next) => {
    let userId = req.params.userId;
    
    allusersCommunityConcat.AllusersCommunityConcat(res, userId)
}

exports.removeCommunityFromContact = (req, res, next) => {
    let contactId = req.params.contactId;
    let communityId = req.params.communityId;

    removeCommunityService.removeCommunity(res, contactId, communityId)
}

exports.statusResendInvitation = (req, res, next) => {
    let userId = req.params.userId;

    userInvitationService.resendInvitation(res, userId, req.body);   
}

exports.cancelInvitationBySender = (req, res, next) => {
    let userId = req.params.userId;
    
    cancelInvitationService.cancelInvitation(req.body, res, userId);   
}