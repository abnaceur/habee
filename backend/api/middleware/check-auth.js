const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if (req.headers.authorizatio == "") {
            res.status(401).json({
                message: "Auth faild !"
            })
        } else {
        const token = req.headers.authorization.split(" ")[1];
        console.log('Token', token);
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decode;
        next();
        }
    } catch (error) {
        res.status(401).json({
            message: "Auth faild middleware"
        })
    }
}