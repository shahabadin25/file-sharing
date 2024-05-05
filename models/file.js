const mongoose=require('mongoose');
const schema=mongoose.Schema;

const fileschema=new schema({
    filename:{
        type:String,
        required:true
    },
    path:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    sender:{
        type:String,
        required:false
    },
    receiver:{
        type:String,
        required:false
    },
    uuid:{
        type:String,
        required:true
    },
},{timestamps:true});

module.exports=mongoose.model('File',fileschema);