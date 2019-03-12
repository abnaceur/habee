const User = require('../../models/user')
const Community = require('../../models/community')
const Event = require('../../models/event')
const utils = require('../utils')
const delAccountEmail = require('../emailServices/accountDeletionEmail')


//TODO DELETED PROFILES, DELETE EVENTS
//TODO DELETE ALL COMMENTS RELATED TO EVEVTS CREATED BY THIS USER

updatingThisUser = (usr) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(usr[0]._id,
            usr[0], {
                new: false,
            },
            function (err, results) {
                if (err) {
                    console.log("deleteCommunityByCreator Error : ", err)
                    resolve(500)
                }
                console.log("Community deleted!")
                resolve(200)
            });
    })
}


updateUserProfile = (usr, communityIn) => {

    return new Promise((resolve, reject) => {
        Community.find({
                communityCreator: usr[0].userId
            }).exec()
            .then(community => {
                usr[0].activeCommunity = community[0].communityId;
                let communities = []
                let i = 0;

                while (i < usr[0].communities.length) {
                    if (usr[0].communities[i] != communityIn.communityId)
                        communities.push(usr[0].communities[i])
                    i++;
                }
                usr[0].communities = communities;
                updatingThisUser(usr)
                    .then(data => {
                        if (data == 200)
                            resolve(200)
                        else
                            resolve(500)
                    })
            })
    })
}

checkAndUpdateUserCommunity = (userId, communityIn) => {

    return new Promise((resolve, reject) => {
        User.find({
                userId: userId
            }).exec()
            .then(usr => {
                if (usr.length == 0)
                    console.log("User not found !:checkAndUpdateUserCommunity")
                else {
                    if (communityIn.communityId == usr[0].activeCommunity) {
                        updateUserProfile(usr, communityIn)
                            .then(data => {
                                if (data == 200)
                                    resolve(200)
                                else
                                    resolve(500)
                            })
                    }
                }
            })
    })
}

deleteCommunityFromMembers = (com, userId) => {
    return new Promise((resolve, reject) => {
        let i = 0;
        if (com.communityMembers.length > 1) {
            while (i < com.communityMembers.length) {
                if (com.communityMembers[i] != userId) {
                    checkAndUpdateUserCommunity(com.communityMembers[i], com)
                        .then(data => {
                            if (data == 200)
                                resolve(200)
                            else
                                resolve(500)
                        })
                }
                i++;
            }
        } else
            resolve(200)
    })
}

deleteCommunityByCreator = (com, userId) => {
    com.communityIsDeleted = true;

    return new Promise((resolve, reject) => {
        deleteCommunityFromMembers(com, userId)
            .then(data => {
                if (data == 200) {
                    Community.findByIdAndUpdate(com._id,
                        com, {
                            new: false,
                        },
                        function (err, results) {
                            if (err) {
                                console.log("deleteCommunityByCreator Error : ", err)
                                resolve(500)
                            }
                            console.log("Community deleted!")
                            resolve(200)
                        })
                } else
                    resolve(200)
            });
    })
}

deleteAllcommunitiesBycreator = (userId) => {

    return new Promise((resolve, reject) => {
        Community.find({
                communityCreator: userId
            }).exec()
            .then(com => {
                if (com.length != 0) {
                    com.map(cm => {
                        deleteCommunityByCreator(cm, userId)
                            .then(check => {
                                if (check == 200) {
                                    resolve(200)
                                } else {
                                    resolve(500)
                                }
                            })
                    })
                }
            }).catch(err => console.log("Error deleteAllcommunitiesBycreator : ", err))
    })
}

deleteThisUser = (user) => {
    return new Promise((resolve, reject) => {
        User.deleteOne({
            userId: user[0].userId
        }, function (err) {
            if (err) {
                console.log("deleteThisUser Err : ", err)
                resolve(500)
            }
            console.log("User deleted with success.")
            resolve(200)
        })
    })
}


deleteThisUserAccount = (res, userId) => {
    User.find({
            userId: userId
        }).exec()
        .then(usr => {
            if (usr.length == 0) {
                res.status(200).json({
                    code: 404,
                    msg: "This user does not exist!"
                })
            } else {
                deleteAllcommunitiesBycreator(usr[0].userId)
                    .then(data => {
                        if (data == 200) {
                            deleteThisUser(usr)
                                .then(delUser => {
                                    if (delUser == 200) {
                                        //todo EMAIL
                                        let name = usr[0].credentials.firstname;
                                        let email = usr[0].credentials.email;
                                        delAccountEmail.accountDeleteEmail(email, "Confirmation de suppression de votre compte", name);
                                        res.status(200).json({
                                            code: 200,
                                            msg: "Account deleted with success!"
                                        })
                                    } else if (delUser == 500) {
                                        res.status(200).json({
                                            code: 500,
                                            msg: "An error occured"
                                        })
                                    }
                                })
                        } else if (data == 500) {
                            res.status(200).json({
                                code: 500,
                                msg: "An error occured!"
                            })
                        }
                    })
            }
        }).catch(err => utils.defaultError(res, err))
}

module.exports = {
    updateUserProfile,
    deleteThisUserAccount,
    deleteCommunityFromMembers,
    deleteCommunityByCreator,
    deleteAllcommunitiesBycreator
}