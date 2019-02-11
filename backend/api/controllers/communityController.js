const utils = require('../services/utils');
const communitySrvice = require('../services/communityServices/communityService')

exports.get_all_communities = (req, res, next) => {
    communitySrvice.getAllcommunities(res)
};

exports.updateSelectedCommunity = (req, res, next) => {
    const userId = req.params.userId;
    const communityId = req.params.communityId;

   communitySrvice.updateSelectedCommunity(res, communityId, userId)
}

exports.addCommunityByCreator = (req, res, next) => {
    const userId = req.params.userId;
    console.log("Body :", req.body);
    let imagePath = utils.getImagePath(req, req.body.communityLogo);
    communitySrvice.addCommunity(req, res, imagePath, userId)
}

exports.getCommunityByCreator = (req, res, next) => {
    const userId = req.params.userId;
    communitySrvice.getCommunityByCreator(userId, res)
}

exports.put_community_by_id = (req, res, next) => {
    const communityId = req.params.communityId
    const communityPhoto = utils.getImagePath(req, req.body.communityLogo)

    communitySrvice.updateCommunity(res, req.body, communityId, communityPhoto)
}

exports.putDeleteCommunity = (req, res, next) => {
    const communityId = req.params.communityId;
    communitySrvice.deleteCommunityById(res, communityId)
}


exports.get_community_by_id = (req, res, next) => {
    const id = req.params.id;
    communitySrvice.getCommunityById(res, id)
};
