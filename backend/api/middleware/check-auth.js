const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
		console.log("ICI");
		//console.log("REQ: ", req);
        if (req.headers.authorizatio == "") {
            res.status(401).json({
                message: "Auth failed !"
            })
        } else {
		console.log("ON EST LA");
		// I changed the index from 1 to 0, otherwise I get authentication error
		//const token = req.headers.authorization.split(" ")[1];
		const token = req.headers.authorization.split(" ")[1];
        console.log('Token', token);
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decode;
        next();
        }
    } catch (error) {
		console.log("ERROR");
		// console.log("REQ: ", req);
        res.status(401).json({
            message: "Auth failed middleware"
        })
    }
}
