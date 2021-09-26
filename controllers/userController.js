const Admin = require('../models/admins');
const Joi = require('joi');
const bcrypt = require('bcryptjs'); // bcryptjs is used to hash passwords.
const chalk = require('chalk');

const registrer_admin = (req, res) => {
    res.render('add-admin')

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
              //need to add pick, lodash package
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
};

//on process.
const updateById_admin = (req, res) => {
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
const viewAll_admins = (req, res) => {
    Admin.find().select('_id admin_name admin_email admin_type status')
    .then((result) => res.send(result))
    .catch((err) => res.status(400).send(err))
};

//on process
const loginBy_admin = (req, res) => {

    const {error} = adminLogin_validation(req.body);   
    if(error) return res.status(404).send(error.details[0].message);
   
       let admin = Admin.findOne({admin_email: req.body.admin_email})
         if(admin) {
                       //found admin
                       //check admin type. == 'ractor'
                       //if admin is rector is can acces all department and all fuclty.
           const checkPassword = bcrypt.compare(req.body.admin_password, admin.admin_password)
           if(!checkPassword) {
              return res.status(400).send('invalid email or password')
           }
           res.send('Login success.')
    }
    else{           
       return res.status(400).send('invalid email or password')
     }        
};


// @JOI package validation function.
//added joi schema to validate before added into the db.

function adminCreate_validation(admin){
    const schema = Joi.object({     
        admin_name: Joi.string().min(3).max(30).required(),
        admin_email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','so'] } }).required(),
        admin_type: Joi.string().min(1),
        admin_password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        status : Joi.string().min(1)   
     });
     return schema.validate(admin);
};
  
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
        admin_email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','so'] } }).required(),
        admin_password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
     });
     return schema.validate(admin);
};
  
  

module.exports ={
    registrer_admin,
    updateById_admin, 
    viewAll_admins,
    loginBy_admin
};