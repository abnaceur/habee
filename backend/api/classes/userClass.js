const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user')
const utils = require('../services/utils');
const userEmails = require('../emailsTemplate/userEmails');
const Community = require('../models/community');

let filterClassInit = [{
    name: "Publique",
    filter: "publicEvents",
    value: false,
}, {
    name: "Sortie entre amis",
    filter: "sortieEntreAmis",
    value: false,
}, {
    name: "Afterwork",
    filter: "afterwork",
    value: false,
}, {
    name: "Cinéma",
    filter: "cinema",
    value: false,
}, {
    name: "Sport",
    filter: "sport",
    value: false,
}, {
    name: "Repas de famille",
    filter: "repasDeFamille",
    value: false,
}, {
    name: "Farniente",
    filter: "farniente",
    value: false,
}, {
    name: "Shopping",
    filter: "shopping",
    value: false,
}, {
    name: "Ballade",
    filter: "ballade",
    value: false,
}, {
    name: "Virée en vélo",
    filter: "virreEnVelo",
    value: false,
}, {
    name: "Virée en voiture",
    filter: "vireEnVoiture",
    value: false,
}, {
    name: "Picnic",
    filter: "picnic",
    value: false,
}, {
    name: "Anniversaire",
    filter: "anniversaire",
    value: false,
}, {
    name: "Danse",
    filter: "danse",
    value: false,
}, {
    name: "Cutlure",
    filter: "cutlure",
    value: false,
}, {
    name: "Nature",
    filter: "nature",
    value: false,
}, {
    name: "Evènement en ville",
    filter: "evenementEnVille",
    value: false,
}, {
    name: "Spectacle",
    filter: "spectacle",
    value: false,
}, {
    name: "Retrouvailles",
    filter: "retrouvailles",
    value: false,
}, {
    name: "Cousinade",
    filter: "cousinade",
    value: false,
}, {
    name: "Groupe de travail",
    filter: "groupeDeTravail    ",
    value: false,
}, {
    name: "Meeting",
    filter: "meeting",
    value: false,
}, {
    name: "Soirée évènement",
    filter: "soireeEvenement",
    value: false,
}, {
    name: "Match",
    filter: "match",
    value: false,
}];

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
                profile: {
                    profileCummunityId: communityId,
                    profilePhoto: "uploads/" + profileAvatar + ".png",
                    profileFirstname: value.firstname,
                    profileLastname: value.lastname,
                    profileIsAdmin: 0,
                    profileUserIsActive: true,
                    profileUserIsDeleted: false,
                },
                filterEvent: filterClassInit,
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
                filterEvent: filterClassInit,
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
        reslve(filterClassInit[0])
    })
}

exports.profileClass = (invitation, user) => {
    //    let profileAvatar = Math.floor(Math.random() * 38) + 1;
    return new Promise((resolve, reject) => {
        resolve({
            profileCummunityId: invitation.invitationCommunityId,
            profilePhoto: user[0].profile.profilePhoto,
            profileUsername: user[0].profile.profileFirstname + " " + user[0].profile.profileLastname,
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
                // TODO REMOVE FILTER ADD OPTIONS
                // user[0].filterEvent.push(filter);
                user[0].communities.push(invitation.invitationCommunityId);
                this.profileClass(invitation, user)
                    .then(profile => {
                        // TODO REMOVE PROFILE ADD OPTION
                        //   user[0].profile.push(profile)
                        this.getUserFirstAndLastname(invitation.invitatorId)
                            .then(sendInfo => {
                                // TODO SEND AN EMAIL OPTION OPTIONAL
                                // let msg = userEmails.inviteExistingContact(sendInfo);
                                this.addUsertoCommunity(user[0].userId, invitation.invitationCommunityId)
                                // utils.sendEmail("Habee TEAM", email, "[INVITATION]", msg);
                                const userToSave = new User(user[0])
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
        filterEvent: filterClassInit,
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