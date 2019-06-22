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

    saveUpdatedCommentsByeventId(data)
}


updateComments = (comments) => {
    if (comments != []) {
        let eventId = comments[0].eventId;
        Comment.find({
                eventId: eventId,
            }).exec()
            .then(data => {
                pushCommentsToclass(data, comments)
            }).catch(err => console.log("updateComments Err:", err))
    }

}

createCommentsForEvent = (eventId, communityId) => {
    let comment = new Comment(classComment.commentClassModal(eventId, communityId))
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