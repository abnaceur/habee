const Community = require('../../models/community');
const User = require("../../models/user");
const utils = require('../utils')
const communityClass = require('../../classes/communityClass')

getUserComs = (userId) => {
    return new Promise((resolve, reject) => {
        User.find({
            userId: userId
        }).exec()
        .then(user => {
            resolve(user[0].communities)
        })
        .catch(err => console.log("getUserComs Err :", err))
    })
}

getUserCreatedComs = (userId, pageTmp) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityCreator: userId,
            communityIsDeleted: false
        })
        .collation({locale:'en',strength: 2})
        .sort({communityName: 'asc'})
        .skip(Number(pageTmp * 10))
        .limit(Number(10))
        .exec()
        .then(communitiesByCreation => {
            resolve(communitiesByCreation)
        }).catch(err => {
            reject(err);
            utils.defaultError(res, err)
        })
    })
}

getUserParticipatedComs = (coms,userId, pageTmp) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityId: {
                '$in': coms, 
            },
            communityCreator: {
                '$ne': userId
            },
            communityIsDeleted: false
        })
        .collation({locale:'en',strength: 2})
        .sort({communityName: 'asc'})
        .skip(Number(pageTmp * 10))
        .limit(Number(10))
        .exec()
        .then(communitiesByParticipation => {
            resolve(communitiesByParticipation)
        }).catch(err => {
            reject(err);
            utils.defaultError(res, err)
        })
    })
}

getUserCreatedComsTotal = (userId) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityCreator: userId,
            communityIsDeleted: false
        })
        .exec()
        .then(communitiesByCreationTotal => {
            resolve(communitiesByCreationTotal.length)
        }).catch(err => {
            reject(err);
            utils.defaultError(res, err)
        })
    })
}

getUserCreatedComsTotalEntitites = (userId) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityCreator: userId,
            communityIsDeleted: false
        })
        .exec()
        .then(communitiesByCreationTotal => {
            resolve(communitiesByCreationTotal)
        }).catch(err => {
            reject(err);
            utils.defaultError(res, err)
        })
    })
}

getUserParticipatedComsTotal = (coms,userId) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityId: {
                '$in': coms,
            },
            communityCreator: {
                '$ne': userId
            },
            communityIsDeleted: false
        })
        .exec()
        .then(communitiesByParticipationTotal => {
            resolve(communitiesByParticipationTotal.length)
        }).catch(err => {
            reject(err);
            utils.defaultError(res, err)
        })
    })
}

getUserParticipatedComsTotalEntities = (coms,userId) => {
    return new Promise((resolve, reject) => {
        Community.find({
            communityId: {
                '$in': coms,
            },
            communityCreator: {
                '$ne': userId
            },
            communityIsDeleted: false
        })
        .exec()
        .then(communitiesByParticipationTotal => {
            resolve(communitiesByParticipationTotal)
        }).catch(err => {
            reject(err);
            utils.defaultError(res, err)
        })
    })
}


async function listAllCommunitiesByUserid (userId, page, res) {
    let pageTmp = 0

    if (page != undefined)
        pageTmp = page;

    let userCommunities = await getUserComs(userId); 
    let userCreatedComs = await getUserCreatedComs(userId, pageTmp);
    let userComsByParticipation = await getUserParticipatedComs(userCommunities, userId, pageTmp);
    let userCreatedComsTotal = await getUserCreatedComsTotal(userId);
    let userComsByParticipationTotal = await getUserParticipatedComsTotal(userCommunities, userId);
   
    res.status(200).json({
        communitiesCreated: {
            Count: userCreatedComsTotal,
            per_page: 10,
            total: userCreatedComsTotal,
            total_pages: Math.floor(userCreatedComsTotal / 10),
            userCreatedComs: userCreatedComs
        },
        communitiesParticipated: {
            Count: userComsByParticipationTotal,
            per_page: 10,
            total: userComsByParticipationTotal,
            total_pages: Math.floor(userComsByParticipationTotal / 10),
            coms :userComsByParticipation,
        }
    });    
}


module.exports = {
    listAllCommunitiesByUserid,
    getUserParticipatedComsTotalEntities,
    getUserCreatedComsTotalEntitites
}