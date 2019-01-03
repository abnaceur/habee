const User = require('../models/user')
const utils = require('../services/utils')
const userClass = require('../classes/userClass')

exports.addNewContact = (email, userId, activeCommunity) => {
    let password = utils.randomValueGenerator()

    return new Promise((resolve, reject) => {
        userClass.userClassAddNew(password, email, activeCommunity)
            .then(user => {
                userClass.saveUser(user, email, password, userId)
                    .then(email => {
                        resolve(email)
                    })
            })
    })
}

exports.addExistingContactToCommunity = (email, existingUser, senderId, activeCommunity) => {

    return new Promise((resolve, reject) => {
        userClass.userAddNewCommnity(email, existingUser, senderId, activeCommunity)
            .then(email => resolve(email))
    })
}

exports.checkIfCommunityExist = (email, activeCommunity) => {

    return new Promise((resolve, reject) => {
        User.find({
                "credentials.email": email,
                "profile.profileCummunityId": activeCommunity
            }).exec()
            .then(usr => {
                resolve(usr.length)
            })
    })
}

exports.emailExist = (email, userId, activeCommunity) => {

    return new Promise((resolve, reject) => {
        User.find({
                "credentials.email": email.value
            }).exec()
            .then(usr => {
                if (usr.length === 0) {
                    this.addNewContact(email.value, userId, activeCommunity)
                        .then(email => resolve(email))
                } else {
                    this.checkIfCommunityExist(email.value, activeCommunity)
                        .then(results => {
                            if (results === 1) {
                                let newEmail = {
                                    value: email.value,
                                    status: 500
                                }
                                resolve(newEmail)
                            } else if (results === 0) {
                                this.addExistingContactToCommunity(email.value, usr, userId, activeCommunity)
                                    .then(email => {
                                        resolve(email)
                                    })
                            }
                        })
                }
            })
    })
}


// Tghis is the main function 
exports.addContacts = (emails, userId, activeCommunity) => {
    let emailsList = [];

    return new Promise((resolve, reject) => {
        emails.map(email => {
            this.emailExist(email, userId, activeCommunity)
                .then(response => {
                    emailsList.push(response)
                    if (emails.length === emailsList.length)
                        resolve(emailsList)
                })
        })

    })
}