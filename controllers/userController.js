const {Admin, admin_validation} = require('../models/admins');
const Joi = require('joi');
const bcrypt = require('bcryptjs'); // bcryptjs is used to hash passwords.
const chalk = require('chalk');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const dashboard_get = (req, res) => {
  res.render('dashboard',{
      msg: 'Welcome to the dashboard page '       
  })
}

const signup_get = (req, res)=>{
  res.render('create',{
      title: 'signup'
    })
}

const login_get =  (req, res) => {
  res.render('login')
}

const signup_post = async (req, res) => {
 
  const {error} = admin_validation(req.body);   
  if(error)  {
    return res.status(404).send(error.details[0].message.toString())
  }
  //hashing password
    bcrypt.hash(req.body.admin_password, 10, (err, hash) => {
    if (err)
      return res.status(500).json({ error: err });
    else {
       Admin.findOne({ admin_email: req.body.admin_email })
        .then(admin => {
          if (admin){
            return res.status(400).send({'user is already created.'})
          }
          else {
            //added a lodash package to pick wanted items only.
            const newAdmin = await new Admin(_.pick(req.body, ['admin_name', 'admin_email', 'admin_type', 'admin_password']));
            newAdmin.admin_password = hash;

            // put here the sign jwt token code            
            const token = jwt.sign({ _id: newAdmin._id }, 'private key');
            console.log('token == ', token); // display the new admin token
            newAdmin.token = token;

            newAdmin.save()
              .then(() => {
                res.cookie('x-auth-token', token).redirect('/');
              })
              .catch(err => console.log(chalk.red('ERROR', err))); // error checking...
          }
        })
        .catch((err) => console.log(chalk.red('ERROR', err)));
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
const login_post = async(req, res) => {

    const {error} = adminLogin_validation(req.body);  
    if(error) return res.status(400).send(error.details[0].message.toString());
    const  email = req.body.admin_email;
    await Admin.findOne({admin_email:email})
    .then((admin)=>{
         if(admin) {
                       //found admin
                       //check admin type. == 'ractor'
                       //if admin is rector is can acces all department and all fuclty.
           const checkPassword = bcrypt.compare(req.body.admin_password, admin.admin_password)
           if(!checkPassword) {
              return res.status(400).send('invalid email or password')
           }

          //  const token = admin.token
          //     res.send({token})
           res.redirect('/')
          }
         else{
       return res.status(400).send('invalid email or password')
      }      
    })
    .catch(err => console.log(chalk.red('ERROR',err)))  
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
        admin_email: Joi.string().min(4).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        admin_password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
     });
     return schema.validate(admin);
};
  
  

module.exports ={
    signup_post,
    updateById_admin, 
    viewAll_admins,
    login_post,
    dashboard_get,
    signup_get,
    login_get
};