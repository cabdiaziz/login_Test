require('./config/database');
const express = require('express');
const routes = require('./routes/userRoutes');
const path = require('path')

require('dotenv').config();
//process.env.Instance_name
const port = process.env.PORT || 4000;

const app = express();


app.set('view engine','ejs')
app.set('views', path.join(__dirname,'/views/'))
const publicDirectory = path.join(__dirname,'./public/')
app.use(express.static(publicDirectory))

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// home page
app.get('/', (req, res) => {
 res.render('login')
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard',{
        msg: 'Welcome to the dashboard page ',
        user: req.body.admin_name
    })
})

//my API'S from router folder
app.use('/admins', routes);

app.get('/about', (req, res) => {
    res.render('about',{
        title: 'about',
        name: 'Abdiaziiz abdullahi Aden.'
    })
});

//404 page.
app.use('*',(req, res) => {
    return res.status(404).render('404',{title: '404'});   
});

app.listen(port,()=>{
    console.log(`This server is running on port http://localhost:${port}`);
});