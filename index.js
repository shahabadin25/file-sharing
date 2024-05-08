//<======================Packages=====================>//
require('dotenv').config();
const express = require('express');
const ConnectDb = require('./config/db');
const path=require('path');
const cors=require('cors');


//Create Express App
const app = express();

//Database Connection 
ConnectDb();

//<======================Middlware=====================>//
const corsOption={
    origin:process.env.ALLOWED_CLIENT.split(',')
}
app.use(cors(corsOption));

//<=================template engine=====================>//
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');




//<======================Routes=====================>//
app.use('/api/files', require('./routes/files'))
app.use ('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const filedb=require('./models/file');

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})

