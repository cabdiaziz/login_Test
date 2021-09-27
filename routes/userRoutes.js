const express = require('express');
const adminController = require('../controllers/userController');
const router = express.Router();


//Register a new user.
router.post('/admin-register', adminController.registrer_admin);
 
//@PUT update the user
router.put('/update-admin/:id', adminController.updateById_admin)

//GET  all users
router.get('/viewAll-admins', adminController.viewAll_admins)

//login user Api
router.post('/login', adminController.loginBy_admin)


module.exports = router;