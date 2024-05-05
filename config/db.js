require("dotenv").config();
const mongoose = require("mongoose");


const ConnectDb =  ()=>{
    try {
        mongoose.connect(process.env.DB_URI)
        console.log("[Database Connected😍]");
    } catch (error) {
        console.log("[Some Error Occured😭]",error);
    }
}

module.exports=ConnectDb;