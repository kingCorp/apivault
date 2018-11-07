const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            message: 'Auth failed'
        })
    }

}