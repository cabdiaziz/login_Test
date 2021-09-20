const express = require('express');
const Admin = require('../models/admins');
const Joi = require('joi');
const bcrypt = require('bcryptjs'); // bcryptjs is used to hash passwords.
const chalk = require('chalk');


const router = express.Router();

//Create user API
router.post('/create', (req, res) => {   
  
 const {error} = users_validation(req.body);   
   if(error){
     return res.send(error.details[0].message);
   }

   const {email} = req.body.admin_email;
   //hashing password
   bcrypt.hash(req.body.admin_password,10,(err,hash) =>{
     if (err)
        return res.status(500).json({error: err});
      else{
        Admin.findOne({email})
        .then(admin => {
          if(admin)
           return res.status(400).json('This user is already exists');
           else{
            const newAdmin = new  Admin({
              admin_name: req.body.admin_name,
              admin_email: req.body.admin_email,
              admin_type: req.body.admin_type,
              admin_password: hash,
              status : req.body.status,
            })
            newAdmin.save()
            .then(() => res.status(201).json({msg: 'Admin is Created'}))
            .catch((err) => console.log(chalk.red('ERROR',err)))   // error checking...
           }
        })
        .catch((err) => console.log(err))
      }
   })
});

// @JOI package validation function.
//added joi schema to validate before added into the db.
function users_validation(admin){
  const schema = Joi.object({     
      admin_name: Joi.string().min(3).max(30).required(),
      admin_email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','so'] } }).required(),
      admin_type: Joi.string().min(1),
      admin_password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
      status : Joi.string().min(1)   
   });
   return schema.validate(user);
}
 

// View all users API
router.get('/admins', (req, res) => {
   Admin.find().select('admin_name admin_email -_id admin_type status createdAt updatedAt')
  .then((result) =>  {
       res.send(result)})
  .catch((err) =>{                                                                                                                                                                                                            
       res.status(400).send(err)
       console.log(err)
      })
});

//login user Api
router.post('/login',async (req, res) =>{
    //findbycredentials is a userdefied function in side the user model.
    try{
      const user = await User.findByCredentials(req.body.admin_email, req.body.admin_password)
      res.send(user)
    }catch(e){
      res.status(400).send()
    }
 
});


module.exports = router;