const express = require('express');
const router = express.Router();
const User = require('../models/user');
const community = require('../models/community');
const Skill = require('../models/skill');
const mongoose = require('mongoose');
var exports = module.exports = {};


exports.get_skills_by_comID = function (usrs, communityId) {
    let countSkills = usrs[0].skills.length;

    while (countSkills > 0) {
        if (Skill.find({
                skillId: usrs[0].skills[countSkills - 1],
                skillForCommunity: communityId
            })
            .exec()
            .then(skill => {
                if (skill.length === 0) {
                    return 1;
                } else
                    return 0;
       })
       .catch())
       usrs[0].skills[countSkills - 1] = null;
        countSkills--;
    }
    return usrs;
}