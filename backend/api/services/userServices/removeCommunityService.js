const User = require('../../models/user')
const Community = require('../../models/community')
const Event = require('../../models/event')
const utils = require('../utils')

async function updatCommunityMembersList(communityId, contactId) {
    return new Promise((resolve, reject) => {
        Community.find({
                communityId: communityId,
                communityIsDeleted: false
            }).exec()
            .then(com => {
                com[0].communityMembers.splice(com[0].communityMembers.indexOf(contactId), 1)
                console.log("Comm :", com)
                Community.findByIdAndUpdate(com[0]._id,
                    com[0], {
                        new: false,
                    },
                    function (err, results) {
                        if (err) resolve(false)
                        resolve(true)
                    })
            })
            .catch(err => {
                console.log("updatCommunityMembersList ERR: ", err);
                resolve(false)
            })
    })
}


async function updatContactCommunitiesList(communityId, contactId) {
    return new Promise((resolve, reject) => {
        User.find({
                userId: contactId
            }).exec()
            .then(usr => {
                usr[0].communities.splice(usr[0].communities.indexOf(communityId), 1)
                console.log("This contact imgo : ", usr)
                User.findByIdAndUpdate(usr[0]._id,
                    usr[0], {
                        new: false,
                    },
                    function (err, results) {
                        if (err) resolve(false)
                        resolve(true)
                    })
            }).catch(err => {
                console.log("updatContactCommunitiesList error : ", err);
                resolve(false)
            })
    })
}

async function removeCommunity(res, contactId, communityId) {
    console.log("we are ere : ", contactId, communityId)
    // Remove community from the user communities list
    console.log("jj -> : ", await updatContactCommunitiesList(communityId, contactId))
    if (await updatContactCommunitiesList(communityId, contactId) == true) {
        if (await updatCommunityMembersList(communityId, contactId) == true) {
            res.status(200).json({
                msg: "Succes",
                code: 200
            })
        } else {
            res.status(200).json({
                msg: "Failed",
                code: 500
            })
        }
    } else {
        res.status(200).json({
            msg: "Failed",
            code: 500
        })
    }
}


module.exports = {
    removeCommunity,
    updatContactCommunitiesList,
    updatCommunityMembersList
}