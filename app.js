require('./config/database');
const express = require('express');
const routes = require('./routes/userRoutes');
const path = require('path')

require('dotenv').config();
//process.env.Instance_name
const port = process.env.PORT || 4000;

const app = express();
app.use(express.json()); // this middleware is recognize the upcamming requests obj as Json eccept html post

app.use(express.urlencoded({ extended: true }));

const publicPath = path.join(__dirname,'./public');

app.set('view engine', 'ejs');
app.use(express.static(publicPath));

// home page
app.get('/', (req, res) => {
 res.render('index')
});

//my API'S from router foler
app.use(routes);

app.get('/about', (req, res) => {
    res.status(200).send('This Api\'s developed by Abdiaziiz abdullahi Aden.' )
});

//404 page.
app.use((req, res) => {
    return res.status(400).json({msg: 'This pase is no longer loaded.'});    
});

app.listen(port,()=>{
    console.log(`This server is running on port http://localhost:${port}`);
});