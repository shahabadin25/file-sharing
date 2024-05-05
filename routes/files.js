const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');

// Middleware for parsing JSON bodies
router.use(express.json());

let storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName= `${Date.now()}-${Math.round(Math.round()*1E9)}${path.extname(file.originalname)}`;
        //extname gives the extension of any file
        cb(null,uniqueName);
    }
})

let upload=multer({
    storage,
    limit:{fileSize:100000*100}//100mb

}).single('myFile');




router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Here you can send the file or perform any other necessary actions
        // For example, you can send the file as a response using res.sendFile()

        // res.sendFile(file.path); // Example of sending the file as a response

        // Or you can perform any other actions based on the file

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

 router.post('/',(req,res)=>{
    
    //store files in uploads
    upload(req,res,async (err)=>{
//validator request
        if(!req.file){
            return res.json({error:'All fields are required'});
        }

       if(err){
        return res.status(500).send({error:err.message});
       } 

       //store into database
       const file=new File({
        filename:req.file.filename,
        uuid:uuid4(),
        path:req.file.path,
        size:req.file.size
       });


       //response->Link
       const response=await file.save();
       return  res.json({files :`${process.env.APP_BASE_URL}/files/${response.uuid}}`});
       //http://localhost:3000/files/22332hskjfdhs-4342jfhsdj

    })

})

router.post('/send',async (req,res)=>{
    const{uuid,emailTo,emailFrom}=req.body;
    //validate request
    if(!uuid || !emailTo ||!emailFrom)
    {
        return res.status(422).send({
            error:`All fields are required.`
        });
    }

    try {
        // get data from database
        const file = await File.findOne({ uuid: uuid });
        if (!file) {
            return res.status(404).send({
                error: `File not found.`
            });
        }

        // Check if the file has already been sent
        if (file.sender) {
            return res.status(422).send({
                error: `Email already sent.`
            });
        }

        // Update file sender and receiver
        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();

        // Send email
        const sendMail = require('../services/emailService');
        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: 'inShare File sharing',
            text: `${emailFrom} shared a file with you`,
            html: require('../services/emailTemplate')({
                emailFrom: emailFrom,
                download: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size / 1000) + ' kb',
                expires: '24 hours'
            })
        });

        return res.status(200).send({
            message: `Email sent successfully.`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: 'Internal Server Error.'
        });
    }
});

module.exports=router;