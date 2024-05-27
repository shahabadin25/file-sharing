//<======================Packages=====================>//
require('dotenv').config();
const express = require('express');
const ConnectDb = require('./config/db');
const path=require('path');
const cors=require('cors');
const emailValidator=require('email-validator');
const errorMiddleware=require("./middleware/error-handler");


//Create Express App
const app = express();

//Database Connection 
ConnectDb();

//<======================Middlware=====================>//
const corsOption = {
    origin: (origin, callback) => {
        const allowedOrigins = process.env.ALLOWED_CLIENT.split(',');
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    methods:'GET,HEAD,POST,PUT,PATCH,OPTIONS,DELETE'
};


app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//<=================template engine=====================>//
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');




//<======================Routes=====================>//
app.use(errorMiddleware);
app.use('/api/files', require('./routes/files'))
app.use ('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));


app.get("/",(req,res)=>{

    return res.send("<h1>Welcome to Adin FileShare😎</h1>")
})



const filedb=require('./models/file');

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})

