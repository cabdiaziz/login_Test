require('./config/database');
const express = require('express');
const routes = require('./router/userRoutes');

require('dotenv').config();
//process.env.Instance_name

const port = process.env.PORT || 4000;

const app = express();

// const publicPath = path.join(__dirname);

// app.set('view engine', 'ejs');

// app.use(express.static(publicPath));
app.use(express.json());




//app.use(express.json()); // this middleware is recognize the upcamming requests obj as Json eccept html post


// home page
app.get('/',   (req, res) => {
 res.status(200).send('Welcome to Home')
});

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