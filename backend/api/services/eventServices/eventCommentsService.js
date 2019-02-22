const Event = require('../../models/event');
const utils = require('../utils');
const User = require('../../models/user');
const Comment = require('../../models/comments');
const classComment = require('../../classes/commentClass')


getAllComments = (res, req, eventId, communityId) => {
    Comment.find({
            eventId: eventId,
            communityId: communityId,
        }).exec()
        .then(data => {
            res.status(200).json({
                conmments: data,
            })

        }).catch(err => utils.defaultError(res, err))
}

saveUpdatedCommentsByeventId = (comment) => {

    Comment.findByIdAndUpdate(comment[0]._id,
        comment[0], {
            new: false,
        },
        function (err, results) {
            if (err) return Console.log("Error : ", err);
            console.log("COMMENT SAVED")
        });
}

pushCommentsToclass = (data, comments) => {
    comments.map(cm => {
        data[0].messages.push({
            userId: cm.userId,
            dateOfCreation: cm.date,
            userPhoto: cm.photo,
            username: cm.username,
            userMessage: cm.comment,
        })
    })

    console.log("Comments after : ", data);
    saveUpdatedCommentsByeventId(data)
}


updateComments = (comments) => {
    console.log("Comments : ", comments)
    if (comments != []) {
        let eventId = comments[0].eventId;
        let communityId = comments[0].eventCommunity;

        console.log("Save comments", comments)
        Comment.find({
                eventId: eventId,
                communityId: communityId,
            }).exec()
            .then(data => {
                console.log('Data comment : ', data)
                pushCommentsToclass(data, comments)
            }).catch(err => utils.defaultError(res, err))
    }

}

createCommentsForEvent = (eventId, communityId) => {
    console.log("Infor : ", eventId, communityId)
    let comment = new Comment(classComment.commentClassModal(eventId, communityId))
    console.log("Comment : ", comment)
    comment.save()
        .then(result => {
            console.log('Comments : ', result)
        })
        .catch(err => {
            utils.defaultError(res, err)
        });
}


getCommentsByEventId = (res, req, eventId, communityId) => {
    getAllComments(res, req, eventId, communityId)
}

module.exports = {
    saveUpdatedCommentsByeventId,
    pushCommentsToclass,
    createCommentsForEvent,
    updateComments,
    getCommentsByEventId,
    getAllComments
}