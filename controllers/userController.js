const {Admin, admin_validation} = require('../models/admins');
const Joi = require('joi');
const bcrypt = require('bcryptjs'); // bcryptjs is used to hash passwords.
// const chalk = require('chalk'); // not usign right know
const _ = require('lodash');


//implement of Singal.R.P


const dashboard_get = (req, res) => {
  res.render('dashboard',{
      msg: 'Welcome to the dashboard page '
  })
}

const signup_get = (req, res)=>{
  res.render('signup',{
      title: 'signup'
    })
}

const login_get =  (req, res) => {
  res.render('login')
}

const about_get =  (req, res) => {
  res.render('about',{
      title: 'about',
      name: 'Abdiaziiz abdullahi Aden.'
  })
}

const notfound_get =(req, res) => {
  return res.status(404).render('404',{
      title: '404'
  });   
}



const signup_post = async (req, res) => {
 
  const {error} = admin_validation(req.body);   
  if(error)  {
    return res.status(404).send(error.details[0].message.toString())
  }
  //hashing password func
    bcrypt.hash(req.body.admin_password, 10, async(err, hash) => { 
    if (err)
      return res.status(500).json({ error: err });
    else {
      let admin = await Admin.findOne({ admin_email: req.body.admin_email })
        // .then(admin => {
          if (admin){
            return res.status(400).send({msg:'user is already created.'})
          }
          else {
            //added a lodash package to pick wanted items only.
            admin = await new Admin(_.pick(req.body, ['admin_name', 'admin_email', 'admin_type', 'admin_password']));

            // put here the sign jwt token code   
            //used SRP         
            const token = await admin.generateToken();
            console.log('signup-token == ', token); // display the new admin token

            admin.admin_password = hash;
            admin.token = token;

            await admin.save()
            res.header('Authorization','Bearer','',token).redirect('/');              
          }
        // })
        // .catch((err) => console.log(chalk.red('ERROR', err)));
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

//test this api on process...

const view_all = async (req, res) => {
  //at this place we don't need a lodash package becouse this 
    let admin = await Admin.find().select('admin_name admin_email admin_type ,status')
    if(admin) return res.send(admin);
    res.status(400).send(err)
};

//on process with SRP and jwt.
const login_post = async(req, res) => {
    const {error} = adminLogin_validation(req.body);  
    if(error) return res.status(400).send(error.details[0].message); // test tostring function.

    let admin = await Admin.findOne({admin_email:req.body.admin_email})
         if(admin) {
                       //found admin/user
                       //check admin type. == 'ractor'
                       //if admin is rector is can acces all department and all fuclty.
           const checkPassword = await bcrypt.compare(req.body.admin_password, admin.admin_password)
           if(!checkPassword) {
              return res.status(400).send('invalid email or password')
           }
           //test jwt from cookies and headers.
           const token = admin.token;
           res.header('Authorization','Bearer','',token);
           console.log('token ==== ',token);
          //     res.send({token})
          res.redirect('/')
          }
         else{
       return res.status(401).send('invalid email or password')
      }      
    // })
    // .catch(err => console.log(chalk.red('ERROR',err)))  
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
    view_all,
    login_post,
    dashboard_get,
    signup_get,
    login_get,
    about_get,
    notfound_get
};