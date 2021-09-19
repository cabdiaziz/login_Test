const express = require('express');
const mongoose = require('mongoose');
const routes = require('./router/userRoutes');
const chalk = require('chalk');

require('dotenv').config();
//process.env.

const app = express();

// const publicPath = path.join(__dirname);

// app.set('view engine', 'ejs');

// app.use(express.static(publicPath));
app.use(express.json());

const dbname = process.env.DB_NAME;
const host = process.env.HOST;
const port = process.env.PORT || 4000;

//mongoDB connection
mongoose.connect(`mongodb://${host}/${dbname}`).
    then(() => console.log('Database is ',chalk.black.bgGreen('Connected.'))).
    catch(chalk.red(err => console.log('Error',err))); //connection error handle.

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