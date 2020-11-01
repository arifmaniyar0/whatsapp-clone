const jwt = require('jsonwebtoken')

exports.verify = function (req, res, next) {
console.log(req.headers.authorization);
    const token = req.headers.authorization;
    // console.log('token',token)
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        next();
    }
    catch(err) {
        // console.log('Error',err.message)
        res.status(200).json({status:400, message : 'you are not authorized'})
    }
}