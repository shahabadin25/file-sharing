const router=require('express').Router();
const File=require('./../models/file');



router.get('/:uuid',async(req,res)=>{//:uuid

    try {
        const file=await File.findOne({
            uuid:req.params.uuid })
            //req.params will have all the parameter present in uuid

            if(!file){
                //if file not found
                return res.render('download',{error:'Link has been expired'})
            }

            //if file found
            return res.render('download',{
                uuid:file.uuid,
                filename:file.filename,
                filesize:file.size,
                download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
                //http://localhost:3000/files/download/sfhjsfksajk-sfdjkaf

            })
        
    } catch (error) {
        return res.render('download',{error:'something went wrong'})
    }
    

   
});//:for unique parameter




module.exports=router;