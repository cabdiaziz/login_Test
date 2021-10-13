const express = require('express');
const adminController = require('../controllers/userController');
// const auth = require('../middleware/auth');  // not using right know.

const router = express.Router();


//@GET dashboard
router.get('/',adminController.dashboard_get);
//@GET signup 
router.get('/signup',adminController.signup_get);
//GET login
router.get('/login',adminController.login_get);
//GET  all users
 router.get('/view-all', adminController.view_all)
//@GET about page.
router.get('/about',adminController.about_get);

//Post Login
router.post('/login',  adminController.login_post);
//@POST signup
router.post('/signup', adminController.signup_post);
//@PUT update the user
// router.put('/:id', adminController.updateById_admin)

//@USE 404 page.
router.use('*',adminController.notfound_get);

module.exports = router;