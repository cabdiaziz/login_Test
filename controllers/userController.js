const {Admin, admin_validation} = require('../models/admins');
const Joi = require('joi');
const bcrypt = require('bcryptjs'); // bcryptjs is used to hash passwords.
const chalk = require('chalk');
const _ = require('lodash')

const registrer_admin = async(req, res) => {
  res.render('register',{
    title: 'create a new admins'
  })

  const {error} = admin_validation(req.body);   
  if(error)  {
    return res.status(404).send(joiError.error.details[0].message)
  }
  //hashing password
    bcrypt.hash(req.body.admin_password,10,(err,hash) =>{
    if (err)
       return res.status(500).json({error: err});
     else{
         Admin.findOne({admin_email: req.body.admin_email})
         .then(admin => {
          if(admin)
             return res.status(400);
          else{
              //added a lodash package to pick wanted items only.
           const newAdmin = new  Admin(_.pick(req.body,['admin_name', 'admin_email','admin_password']))
           newAdmin.admin_password = hash;
           newAdmin.save()
           .then(() =>{
            const token = admin.generatetokens()
            res.header('auth-token', token).redirect('/login')
          })
           .catch((err) => console.log(chalk.red('ERROR',err)))   // error checking...
          }  
        })
        .catch((err) => console.log(chalk.red('ERROR',err)))        
     }
     
  })
};

//on process.
const updateById_admin =  (req, res) => {
  const findAdmin =  Admin.findById(req.params.Admin._id)
  if(!findAdmin) return res.send('This Admin is not Found !')
  
  const {error} = adminUpdate_validation(req.body);
  if(error) return res.send(error.details[0].message);
  
  findAdmin.admin_name = req.body.admin_name,
  findAdmin.admin_email = req.body.admin_email,
  findAdmin.admin_type = req.body.admin_type,
  findAdmin.status = req.body.status,

  res.send(findAdmin);
};

//add pick ,  lodash package.
const viewAll_admins =  (req, res) => {
    Admin.find().select('admin_name admin_email admin_type ,status')
    .then(result => res.send(result))
    .catch((err) => res.status(400).send(err))
};

//on process
const loginBy_admin = async (req, res) => {

    let email = req.body.admin_email;
    const {error} = adminLogin_validation(req.body);   
    console.log( req.body.admin_email)
    if(error) return res.status(400).send(error.details[0].message.toString());
   
       let admin = await Admin.findOne({admin_email:email})
         if(admin) {
                       //found admin
                       //check admin type. == 'ractor'
                       //if admin is rector is can acces all department and all fuclty.
           const checkPassword = await bcrypt.compare(req.body.admin_password, admin.admin_password)
           if(!checkPassword) {
              return res.status(400).send('invalid email or password')
           }
           
           const token = admin.generatetokens()
           res.send(token)
           res.redirect('/dashboard')
         }
         else{           
       return res.status(400).send('invalid email or password')
      }        
};


// @JOI package validation function.
//added joi schema to validate before added into the db.

// function adminCreate_validation(admin){
//     const schema = Joi.object({     
//         admin_name: Joi.string().min(3).max(30).required(),
//         admin_email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','so'] } }).required(),
//         admin_type: Joi.string().min(1),
//         admin_password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
//         status : Joi.string().min(1)   
//      });
//      return schema.validate(admin);
// };
  
function adminUpdate_validation(admin){
    const schema = Joi.object({     
        admin_name: Joi.string().min(3).max(30).required(),
        admin_email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','so'] } }).required(),
        admin_type: Joi.string().min(1),
        status : Joi.string().min(1)   
     });
     return schema.validate(admin);
};

function adminLogin_validation(admin){
    const schema = Joi.object({     
        admin_email: Joi.string().min(4).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        admin_password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
     });
     return schema.validate(admin);
};
  
  

module.exports ={
    registrer_admin,
    updateById_admin, 
    viewAll_admins,
    loginBy_admin
};