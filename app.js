require('./config/database');
const express = require('express');
const routes = require('./routes/userRoutes');
const path = require('path')
const morgan = require('morgan')
var cookieParser = require('cookie-parser');

require('dotenv').config();
//process.enviremantalcari.Instance_name
const port = process.env.PORT || 4000;

const app = express();
app.use(morgan('tiny'))
app.use(cookieParser())


app.set('view engine','ejs')
app.set('views', path.join(__dirname,'/views/'))
const publicDirectory = path.join(__dirname,'./public/')
app.use(express.static(publicDirectory))

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//my API'S from router folder
app.use(routes);

app.listen(port,()=>{
    console.log(`This server is running on port http://localhost:${port}`);
});