var path = require('path');

exports.accountDeleteEmail = (to, subject, name) => {
    var nodemailer = require('nodemailer');
    var EmailTemplate = require('email-templates').EmailTemplate;
    var sesTransport = require('nodemailer-ses-transport');
    var transporter;
    var templateDir = path.join(__dirname, "../../", 'emailsTemplate', 'templates/deleteAccount/')

    var testMailTemplate = new EmailTemplate(templateDir)

    var locals =
    {
        name: name
    }


    if (process.env.NODE_ENV == "dev" && process.env.IS_AWS == "true") {
        console.log("========= AWS SERVER SES EMAIL ==========")
        var SESCREDENTIALS = {
            accessKeyId: "AKIAI6S2IOY4WDZLHCOA",
            secretAccessKey: "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"
        };

        var transporter = nodemailer.createTransport(sesTransport({
            accessKeyId: SESCREDENTIALS.accessKeyId,
            secretAccessKey: SESCREDENTIALS.secretAccessKey,
        }));

        testMailTemplate.render(locals, function (err, temp) {
            if (err) {
                console.log("error", err);
            } else {
                var mailOptions = {
                    from: 'no-reply <no-reply@habee.fr>',
                    to: to,
                    subject: subject,
                    text: temp.text,
                    html: temp.html // html body
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log("An ERROR : ===> ", error);
                    } else {
                        console.log('Message sent: ' + info);
                    }
                });
            }
        })

    } else {
        var transporter = nodemailer.createTransport({
            host: 'send.one.com', //host of mail service provider
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });


        testMailTemplate.render(locals, function (err, temp) {
            if (err) {
                console.log("error", err);
            } else {
                transporter.sendMail({
                    from: process.env.USER,
                    to: to,
                    subject: subject,
                    text: temp.text,
                    html: temp.html
                }, function (error, info) {
                    if (error) {
                        console.log("accountDeleteEmail : An error occured!");
                    } else
                        console.log('Message sent: ' + info.response);
                })
            }
        })
    }
}