const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user')
const utils = require('../services/utils');
const userEmails = require('../emailsTemplate/userEmails');
const Community = require('../models/community');


exports.creatNewAccountUser = (value) => {
    let userIdGen = value.email.substring(0, value.email.search('@')) + '_' + Math.floor(Math.random() * 10000) + '_' + value.email.substring(value.email.search('@'), value.email.lenght);
    let communityId = value.email.substring(0, value.email.search('@')) + Math.floor(Math.random() * 10000);
    let profileAvatar = Math.floor(Math.random() * 35) + 1;

    return new Promise((resolve, reject) => {

        bcrypt.hash(value.password, 10, (err, hash) => {

            resolve({
                _id: new mongoose.Types.ObjectId,
                userId: userIdGen,
                activeCommunity: communityId,
                activeProfileRole: 0,
                credentials: {
                    firstname: value.firstname,
                    lastname: value.lastname,
                    birthDate: "",
                    address: "",
                    email: value.email,
                    phone: "",
                    password: hash,
                },

                communities: [
                    communityId
                ],
                profile: [{
                    profileCummunityId: communityId,
                    profilePhoto: "uploads/" + profileAvatar + ".png",
                    profileUsername: value.lastname + ' ' + value.firstname,
                    profileIsAdmin: 0,
                    profileUserIsActive: true,
                    profileUserIsDeleted: false,
                }],
                filterEvent: [{
                    filterCommunity: communityId,
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
                passions: [],
                skills: [],
                currentEvents: [],
                "currentEvents.eventsICreated": [],
                "currentEvents.eventsIParticipate": [],
                parameters: [],
                passedEvents: [],
                "passedEvents.PassedevenementsICreated": [],
                "passedEvents.PassedEvenementsParticipated": [],

            })
        })
    })
}

exports.userClassAddNew = (password, email, activeCommunity) => {
    let userIdGen = email.substring(0, email.search('@')) + '_' + Math.floor(Math.random() * 10000) + '_' + email.substring(email.search('@'), email.lenght);

    return new Promise((resolve, reject) => {

        bcrypt.hash(password, 10, (err, hash) => {

            resolve({
                _id: new mongoose.Types.ObjectId,
                userId: userIdGen,
                activeCommunity: activeCommunity,
                activeProfileRole: 0,
                credentials: {
                    firstname: 'Nom_' + Math.floor(Math.random() * 10000),
                    lastname: 'Prenom_' + Math.floor(Math.random() * 10000),
                    birthDate: "",
                    address: "",
                    email: email,
                    phone: "",
                    password: hash,
                },

                communities: [activeCommunity],
                profile: [{
                    profileCummunityId: activeCommunity,
                    profilePhoto: "uplaods/",
                    profileUsername: 'UserName_' + Math.floor(Math.random() * 10000),
                    profileIsAdmin: 0,
                    profileUserIsActive: true,
                    profileUserIsDeleted: false,
                }],
                filterEvent: [{
                    filterCommunity: activeCommunity,
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
                passions: [],
                skills: [],
                currentEvents: [],
                "currentEvents.eventsICreated": [],
                "currentEvents.eventsIParticipate": [],
                parameters: [],
                passedEvents: [],
                "passedEvents.PassedevenementsICreated": [],
                "passedEvents.PassedEvenementsParticipated": [],

            })
        })
    })
}

exports.getUserFirstAndLastname = (userId) => {

    return new Promise((resolve, reject) => {
        User.find({
                userId: userId
            }).exec()
            .then(usr => {
                resolve({
                    firstName: usr[0].credentials.firstname,
                    lastName: usr[0].credentials.lastname
                })
            }).catch(err => utils.defaultError(err))
    })
}

exports.saveUser = (userClass, email, password, userId) => {
    const user = new User(userClass);

    return new Promise((resolve, reject) => {
        this.getUserFirstAndLastname(userId)
            .then(sendInfo => {
                user.save()
                    .then(usr => {
                        let msg = userEmails.inviteNewContact(email, password, sendInfo);
                        utils.sendEmail("Habee TEAM", email, "[INVITATION]", msg);
                        emailRes = {
                            value: email,
                            status: 200
                        }
                        resolve(emailRes)
                    }).catch(err => utils.defaultError(err))
            })
    })
}

exports.filterEventClass = (activeCommunity) => {

    return new Promise((reslve, reject) => {
        reslve({
            filterCommunity: activeCommunity,
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
        })
    })
}

exports.profileClass = (invitation, user) => {
//    let profileAvatar = Math.floor(Math.random() * 38) + 1;
    return new Promise((resolve, reject) => {
        resolve({
            profileCummunityId: invitation.invitationCommunityId,
            profilePhoto: user[0].profile[0].profilePhoto,
            profileUsername: user[0].profile[0].profileUsername,
            profileIsAdmin: 0,
            profileUserIsActive: true,
            profileUserIsDeleted: false,
        })
    })
}



exports.addUsertoCommunity = (userId, communityId) => {
    Community.find({
        communityId: communityId
    }).exec()
    .then(community => {
        community[0].communityMembers.push(userId)
        Community.findByIdAndUpdate(community[0]._id,
            community[0], {
                new: false,
            },
            function (err, results) {
                if (err) return console.log("addUsertoCommunity : ", err);
                console.log("Community updated with success!")
            });
    }).catch(err => console.log("addUsertoCommunity error : ", err))
}



exports.userAddNewCommnity = (invitation, user) => {

    return new Promise((resolve, reject) => {
        this.filterEventClass(invitation.invitationCommunityId)
            .then(filter => {
                user[0].filterEvent.push(filter);
                user[0].communities.push(invitation.invitationCommunityId);
                this.profileClass(invitation, user)
                    .then(profile => {
                        user[0].profile.push(profile)
                        this.getUserFirstAndLastname(invitation.invitatorId)
                            .then(sendInfo => {
                                let msg = userEmails.inviteExistingContact(sendInfo);
                                this.addUsertoCommunity(user[0].userId, invitation.invitationCommunityId)
                                // utils.sendEmail("Habee TEAM", email, "[INVITATION]", msg);
                                const userToSave  = new User(user[0])
                                userToSave.save()
                                    .then(usr => {
                                        resolve(200)
                                    }).catch(err => console.log("ERROR: ", err))
                            })
                    })
            }).catch(err => utils.defaultError(res, err))
    })
}

exports.userClassPost = (req, hash, imagePathprofilePhoto) => {
    let userPostClass = {
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
            profilePhoto: imagePathprofilePhoto,
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
    }

    return userPostClass
}