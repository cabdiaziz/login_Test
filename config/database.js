const mongoose = require('mongoose');
const chalk = require('chalk');

require('dotenv').config();
//process.env.Instance_name

const dbname = process.env.DB_NAME;
const host = process.env.HOST;

//mongoDB connection
mongoose.connect(`mongodb://${host}/${dbname}`).
    then(() => console.log('Database is ',chalk.black.bgGreen('Connected.'))).
    catch(chalk.red(err => console.log('Error',err))); //connection error handle.


require('../routes/userRoutes');