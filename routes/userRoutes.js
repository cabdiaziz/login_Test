const express = require('express');
const adminController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/', async(req, res) => {
    res.render('login')
});


//@GET dashboard
router.get('/dashboard',adminController.dashboard_get)
//@GET registration 
router.get('/create',adminController.signup_get)
//GET  all users
router.get('/', adminController.viewAll_admins)



//Post Login
router.post('/login',  adminController.loginBy_admin)
//@POST Register a new user.
router.post('/create', adminController.registrer_admin)
//@PUT update the user
router.put('/:id', adminController.updateById_admin)


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