const express = require('express');
const adminController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();




//@GET dashboard
router.get('/',auth,adminController.dashboard_get)
//@GET registration 
router.get('/signup',adminController.signup_get)
//GET login
router.get('/login',adminController.login_get);
//GET  all users
// router.get('/users', adminController.viewAll_admins)



//Post Login
router.post('/login',  adminController.login_post)
//@POST Register a new user.
router.post('/signup', adminController.signup_post)
//@PUT update the user
// router.put('/:id', adminController.updateById_admin)


router.get('/about', (req, res) => {
    res.render('about',{
        title: 'about',
        name: 'Abdiaziiz abdullahi Aden.'
    })
});


//404 page.
router.use('*',(req, res) => {
    return res.status(404).render('404',{
        title: '404'
    });   
});


module.exports = router;