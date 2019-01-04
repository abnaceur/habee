const Community = require('../../models/community');
const User = require("../../models/user");
const utils = require('../utils')


exports.getUserCommunities = (userId) => {

    return new Promise((resolve, reject) => {
        User.find({
                userId: userId
            }).exec()
            .then(usr => {
                console.log("User : ", usr[0].communities)
                resolve(usr[0].communities)
            })
    })
}

exports.getAllcommunitiesFromUser = (userCommunities) => {
    let myComs = [];

    userCommunities.map(com => {
        myComs.push(com.communityId)
    })

    return myComs
}


exports.ifCommunityExist = (communities, userCommunities, res) => {
    let userCommunitiesById = this.getAllcommunitiesFromUser(userCommunities)
    let allCommunities = utils.concatArrays(communities, userCommunitiesById)
   console.log("Concat  :", allCommunities)
    let i = 0;
    while (allCommunities[i]) i++;
    let allCommunitiesUnique = utils.uniqueArray(0, allCommunities, i)
    console.log("Unique :", allCommunitiesUnique)
    this.getAllcommunities(allCommunitiesUnique, res)
}

exports.getAllcommunities = (communities, res) => {
    Community.find({
        communityId: communities
    }).then(comsInfo => {
        res.status(200).json({
            communities: comsInfo
        })
    })
}


exports.getCommunityByCreator = (userId, res) => {
    this.getUserCommunities(userId)
        .then(communities => {
            console.log("Communoties list  :", communities)
            Community.find({
                    communityCreator: userId
                })
                .exec()
                .then(coms => {
                    (coms.length != 0 && communities.length != 0) ?
                        this.ifCommunityExist(communities, coms, res) :
                        (coms.length == 0 && communities.length != 0) ? 
                        this.getAllcommunities(communities, res) :
                    res.status(200).json({
                        communities: coms
                    })
                }
                ).catch(err => {
                    res.status(500).json({
                        Error: err
                    })
                })
        })
}