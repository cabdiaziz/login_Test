const express = require('express');
const Admin = require('../models/admins')
const Joi = require('joi');
const bcrypt = require('bcryptjs'); // bcryptjs is used to hash passwords.
const chalk = require('chalk');

const router = express.Router();

//Create user
router.post('/add-admin', (req, res) => {   

  const {error} = adminCreate_validation(req.body);   
   if(error) return res.status(404).send(error.details[0].message);

   const admin_email = req.body.admin_email;
  
   //hashing password
   bcrypt.hash(req.body.admin_password,10,(err,hash) =>{
     if (err)
        return res.status(500).json({error: err});
      else{
        Admin.findOne({admin_email})
        .then(admin => {
          if(admin)
           return res.status(400).json('This user is already exists');
           else{
            const newAdmin = new  Admin({
              admin_id : req.body.admin_id,
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
 
//@PUT update the user
router.put('/add-admin/:id', async (req, res) => {
  
  const findAdmin = await Admin.findById(req.params.admin_id)
  if(!findAdmin) return res.send('This Admin is not Found !')
  
  const {error} = adminUpdate_validation(req.body);
  if(error) return res.send(error.details[0].message);
  
  findAdmin.admin_name = req.body.admin_name,
  findAdmin.admin_email = req.body.admin_email,
  findAdmin.admin_type = req.body.admin_type,
  findAdmin.status = req.body.status,

  res.send(findAdmin);

})

//GET  all users
router.get('/admins', (req, res) => {
   Admin.find().select('-_id admin_name admin_email admin_type status createdAt updatedAt')
  .then((result) => res.send(result))
  .catch((err) => res.status(400).send(err))
});

//login user Api
router.post('/login',async (req, res) =>{
    
  
 
});


// @JOI package validation function.
//added joi schema to validate before added into the db.
function adminCreate_validation(admin){
  const schema = Joi.object({     
      admin_name: Joi.string().min(3).max(30).required(),
      admin_email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','so'] } }).required(),
      admin_type: Joi.string().min(1),
      admin_password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
      status : Joi.string().min(1)   
   });
   return schema.validate(admin);
}

function adminUpdate_validation(admin){
  const schema = Joi.object({     
      admin_name: Joi.string().min(3).max(30).required(),
      admin_email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','so'] } }).required(),
      admin_type: Joi.string().min(1),
      status : Joi.string().min(1)   
   });
   return schema.validate(admin);
}


module.exports = router;