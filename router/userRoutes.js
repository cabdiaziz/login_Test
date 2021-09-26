const express = require('express');
const adminController = require('../controller/userController');

const router = express.Router();

//Register a new user.
router.post('/add-admin', adminController.registrer_admin );
 
//@PUT update the user
router.put('/update-admin/:id', adminController.updateById_admin)

//GET  all users
router.get('/viewAll-admins', adminController.viewAll_admins)

//login user Api
router.post('/login-admin', adminController.loginBy_admin)


module.exports = router;