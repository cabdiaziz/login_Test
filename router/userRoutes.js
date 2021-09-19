const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs'); // bcryptjs is used to hash passwords.


const router = express.Router();

//Create user API
router.post('/create', (req, res) => {   
   const email = req.body.email;
   //simple validation
   if (!req.body.username || !email || !req.body.password) {
       res.status(400).json({msg : 'please fill all data'})
   }
        //hashing password
   bcrypt.hash(req.body.password,10,(err,hash) =>{
     if (err)
        return res.status(500).json({error: err});
      else{
        User.findOne({email})
        .then(user => {
          if(user)
           return res.status(400).json('This user is already exists');
           else{
            const newUser = new User({
              username: req.body.username,
              email: email,
              password: hash,
              roleAdmin : req.body.roleAdmin,
            })
            newUser.save()
            .then(() => res.status(201).json({msg: 'User is Created'}))
            .catch((err) => console.log(err))   // error checking...
           }
        })
        .catch((err) => console.log(err))
      }
   })
});
 
// View all users API
router.get('/users', (req, res) => {
  User.find()
  .then((result) =>  {
       res.send(result)
      })
  .catch((err) =>{
       res.status(400).send(err)
       console.log(err)
      })
});

//login user Api
router.post('/login', async (req, res) =>{
  try{
    //findbycredentials is a userdefied function in side the user model.
      const user = await User.findByCredentials(req.body.email, req.body.password)
      res.send(user);
    } catch(e) {
      res.status(400).send()
    }
});


module.exports = router;