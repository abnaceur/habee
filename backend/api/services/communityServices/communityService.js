const Community = require('../../models/community');
const User = require("../../models/user");
const utils = require('../utils')
const communityClass = require('../../classes/communityClass')


//TODO GET COMMUNITYIES ONLY FOR A USER
exports.getAllcommunitiesIds = () => {
 return new Promise((resolve, reject) => {
    Community.find({
        communityIsDeleted: false
    })
    .exec().then(data => {
        let arr = [];
        data.map(d => {
            arr.push(d.communityId)
        })
        console.log("Da :", arr)
        resolve(arr)
    })
 })
}

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
    this.getAllcommunitiesById(allCommunitiesUnique, res)
}

exports.getAllcommunitiesById = (communities, res) => {
    Community.find({
        communityId: communities,
        communityIsDeleted: false
    }).then(comsInfo => {
        res.status(200).json({
            communities: comsInfo
        })
    })
}

exports.getCommunityByCreator = (userId, res) => {
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
                        this.getAllcommunitiesById(communities, res) :
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

exports.getAllcommunities = (res) => {
    Community.find()
        .exec()
        .then(communities => {
            if (communities.length === 0) {
                return res.status(404).json({
                    code: "101",
                    message: "There are no communities!"
                })
            } else {
                res.status(200).json({
                    Commuinities: communities
                });
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        })
}

exports.updateUser = (res, usr) => {

    User.findByIdAndUpdate(usr[0]._id,
        usr[0], {
            new: false,
        },
        function (err, results) {
            if (err) return res.status(500).json(err);
            res.status(200).json({
                count: 1,
                msg: "Updated with success !"
            })
        });
}

exports.updateSelectedCommunity = (res, communityId, userId) => {

    User.find({
            userId: userId
        })
        .exec()
        .then(usr => {
            usr[0].activeCommunity = communityId;
            this.updateUser(res, usr)
        })
        .catch(err => {
            utils.defaultError(res, err)
        })
}

exports.addCommunity = (req, res, imagePath, userId) => {
    Community.find({
            communityId: req.body.communityId,
            communityIsDeleted: false
        }).exec()
        .then(com => {
            if (com.length > 0) {
                res.status(200).json({
                    count: 0,
                    msg: "This name exist !"
                })
            } else {
                User.find({
                        userId: userId
                    }).exec()
                    .then(usr => {
                        const community = new Community(communityClass.communityClassModal(req, imagePath));
                        community
                            .save()
                            .then(comm => {
                                communityClass.updateUserWhenCommunityAdd(usr, req, res)
                            })
                            .catch(err => {
                                utils.defaultError(res, err)
                            });
                    }).catch(err => {
                        utils.defaultError(res, err)
                    })

            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        })
}

exports.getCommunityById = (res, id) => {
    Community.find({
            communityId: id,
            communityIsDeleted: false,
        })
        .exec()
        .then(com => {
            if (com.length === 0) {
                return res.status(200).json({
                    count: 0,
                    message: "Community not found or id not valid!"
                })
            } else {
                res.status(200).json({
                    count: com.length,
                    community: com.map(com => {
                        return ({
                            communityDescripton: com.communityDescripton,
                            communityLogo: com.communityLogo,
                            communityName: com.communityName
                        })
                    })
                });
            }
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
}

exports.newUserCommunity = (user) => {
    const community = new Community(communityClass
        .communityClassModalOnUserCreaton(user));
    community
        .save()
        .then(comm => comm)
        .catch(err => utils.defaultError(res, err));
}

exports.filterCommunities = (data, userId) => {
    return new Promise ((resolve, reject) => {
        let uniq = [];
        data.map(com => {
            if (com.communityCreator != userId)
                uniq.push(com)
        })
        resolve(uniq);
    })
}

exports.getCommunitiesByParticipation = (res, userId) => {
    Community.find({
        communityMembers: userId,
        communityIsDeleted: false
    }).exec()
    .then(data => {
        this.filterCommunities(data, userId)
        .then(data => {
            res.status(200).json({
                code: 200,
                data: data
            })
        })
        .catch(err => console.log("filterCommunities : ", err))
    }).catch(err => utils.defaultError(res, err))
}