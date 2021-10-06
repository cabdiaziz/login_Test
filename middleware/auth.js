const jwt = require('jsonwebtoken')
const Admin = require('../models/admins')

module.exports = function (req, res, next){
    
        const token = res.cookie('x-auth-token')
        console.log('newadmin-token === ',token);
        if(!token){
          return res.status(401).send('access reject.')
        }
        try{
        //decode the token  
        const decodeToken = jwt.verify(token, 'private key')
        let admin = Admin.findOne({_id: decodeToken._id, 'tokens.token': token})
        .then(() => {
            if(!admin) throw new Error()

            req.admin = admin
            next()
        })
        .catch( err => console.log(err))
    }catch(e){
        return res.status(400).send({error: 'please authenticate / login.'})
    }
}