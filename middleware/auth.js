const jwt = require('jsonwebtoken')
const Admin = require('../models/admins')

module.exports = async function (req, res, next){
    try{
        const token = req.header('Authorization').replace('Bearer', '');
        console.log('auth-token === ', token); //testing..

        const decodeToken = jwt.verify(token, 'privatekey')
        let admin = Admin.findOne({_id: decodeToken._id, 'token': token})

        if(!admin) throw new Error()

        req.admin = admin
        next()    
    }catch(e){
        return res.status(401).send({error: 'please authenticate .'}) //is soo diiwaan gali fadlan.
    }
}