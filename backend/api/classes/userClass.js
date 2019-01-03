const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user')
const utils = require('../services/utils');
const userEmails = require('../emailsTemplate/userEmails');

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
                let msg = userEmails.inviteNewContact(email, password, sendInfo);
                utils.sendEmail("Habee TEAM", email, "[INVITATION]", msg);
                user.save()
                    .then(usr => {
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

exports.profileClass = (activeCommunity) => {

    return new Promise((resolve, reject) => {
        resolve({
            profileCummunityId: activeCommunity,
            profilePhoto: "uplaods/",
            profileUsername: 'UserName_' + Math.floor(Math.random() * 10000),
            profileIsAdmin: 0,
            profileUserIsActive: true,
            profileUserIsDeleted: false,
        })
    })
}





exports.userAddNewCommnity = (email, user, senderId, activeCommunity) => {

    return new Promise((resolve, reject) => {
        this.filterEventClass(activeCommunity)
            .then(filter => {
                user[0].filterEvent.push(filter);
                user[0].communities.push(activeCommunity);
                this.profileClass(activeCommunity)
                    .then(profile => {
                        user[0].profile.push(profile)
                        this.getUserFirstAndLastname(senderId)
                            .then(sendInfo => {
                                let msg = userEmails.inviteExistingContact(sendInfo);
                                utils.sendEmail("Habee TEAM", email, "[INVITATION]", msg);
                                const userToSave  = new User(user[0])
                                userToSave.save()
                                    .then(usr => {
                                        emailRes = {
                                            value: email,
                                            status: 202
                                        }
                                        resolve(emailRes)
                                    }).catch(err => console.log("ERROR: ", err))
                            })
                    })
            })
    })
}