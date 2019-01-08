const Community = require('../../models/community');
const User = require("../../models/user");
const utils = require('../utils')


exports.getUserCommunities = (userId) => {

    return new Promise((resolve, reject) => {
        User.find({
                userId: userId
            }).exec()
            .then(usr => {
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
    let i = 0;
    let userCommunitiesById = this.getAllcommunitiesFromUser(userCommunities)
    let allCommunities = utils.concatArrays(communities, userCommunitiesById)

    while (allCommunities[i]) i++;
    let allCommunitiesUnique = utils.uniqueArray(0, allCommunities, i)
    this.getAllcommunities(allCommunitiesUnique, res)
}

exports.getAllcommunities = (communities, res) => {
    Community.find({
        communityId: communities,
        communityIsDeleted: false
    }).then(comsInfo => {
        res.status(200).json({
            communities: comsInfo
        })
    })
}


exports.getCommunityByCreator =     (userId, res) => {
    this.getUserCommunities(userId)
        .then(communities => {
            Community.find({
                    communityCreator: userId,
                    communityIsDeleted: false
                })
                .exec()
                .then(coms => {
                    (coms.length != 0 && communities.length != 0) ?
                    this.ifCommunityExist(communities, coms, res):
                        (coms.length == 0 && communities.length != 0) ?
                        this.getAllcommunities(communities, res) :
                        res.status(200).json({
                            communities: coms
                        })
                }).catch(err => {
                    res.status(500).json({
                        Error: err
                    })
                })
        })
}

exports.updateCommunityById = (res, community) => {
  Community.findByIdAndUpdate(community[0]._id,
        community[0], {
            new: false,
        },
        function (err, results) {
            if (err) return res.status(500).json(err);
            res.status(200).json({
                code: 200,
                msg: "Community updated with success !"
            })
        });
}


exports.updateThis = (res, community, communityInfo, communityPhoto) => {
    community[0].communityName = communityInfo.communityName;
    community[0].communityDescripton = communityInfo.communityDescripton;
    community[0].communityLogo = communityPhoto;
    this.updateCommunityById(res, community)
}

exports.checkIfNameExist = (res, community, communityInfo, communityPhoto) => {

    Community.find({
        communityName: communityInfo.communityName,
        communityIsDeleted: false
    }).exec()
    .then(com => {
        if (com.length != 0) {
            res.status(200).json({
                code: 202,
                msg: "This name exist!"
            })
        } else {
            this.updateThis(res, community, communityInfo, communityPhoto)
        }
    })
}

exports.updateCommunity = (res, communityInfo, communityId, communityPhoto) => {

    Community.find({
            communityId: communityId,
            communityIsDeleted: false
        }).exec()
        .then(community => {
            if (community[0].communityName != communityInfo.communityName) {
                this.checkIfNameExist(res, community, communityInfo, communityPhoto)
            }
        })
}

exports.deleteCommunityById = (res, communityId) => {
    Community.find({
        communityId: communityId,
        communityIsDeleted: false
    }).exec()
    .then(community => {
        community[0].communityIsDeleted = true;
        this.updateCommunityById(res, community)
    })
}