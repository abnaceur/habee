const User = require('../../models/user')
const Community = require('../../models/community')
const Event = require('../../models/event')
const utils = require('../utils')
const bcrypt = require('bcrypt');
const resetPswEmails = require('../../services/emailServices/resetPasswordEmeailService')


resetPsw = (email, res) => {
    User.find({
            "credentials.email": email
        }).exec()
        .then(user => {
            if (user.length == 0) {
                res.status(200).json({
                    code: 404,
                    msg: "Cet email n'exist pas!"
                })
            } else {
                let psw = utils.randomValueGenerator()
                bcrypt.hash(psw, 10, (err, hash) => {
                    user[0].credentials.password = hash
                    User.findByIdAndUpdate(user[0]._id,
                        user[0], {
                            new: false,
                        },
                        function (err, results) {
                            let name = user[0].credentials.firstname;
                            if (err) return res.status(500).json(err);
                            resetPswEmails.sendEmailResetPassword(email, "Ré-initialisation de votre mot de passe", email, psw, name);
                            res.status(200).json({
                                code: 200,
                                msg: "Password reset successefully"
                            })
                        });

                })
            }
        })

}



module.exports = {
    resetPsw
}