const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const File=require('../models/file')
const {v4:uuidv4}=require('uuid')


let storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{

        const uniqueName=`${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`

        cb(null,uniqueName);
    }

})

let upload=multer({
    storage:storage,
    limit:{filSize: 1000000 * 100}
}).single('myFile')



router.post('/',(req,res)=>{
    
    

    //store file
    upload(req, res, async (err) => {
        if (err) {
          return res.status(500).send({ error: err.message });
        }
          const file = new File({
              filename: req.file.filename,
              uuid: uuidv4(),
              path: req.file.path,
              size: req.file.size
          });
          const response = await file.save();
          res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
        });



    


    //Response->Link
})

router.post('/send',async (req,res)=>{
    const {uuid,emailTo,emailFrom}=req.body;
    //validating
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error:"All fieds are required"})
    }

    const file=await File.findOne({uuid:uuid});

    //if sender already exists for this file
    if(file.sender)
    {
        return res.status(422).send({error:"Email already sent"});
    }

    //save sender and receiver
    file.sender=emailFrom;
    file.receiver=emailTo;
    const response=await file.save();

    //sending email

    const sendMail=require('../services/emailService');
    sendMail({
        to:emailTo,
        from:"aarushishanker3108@gmail.com",
        
        subject:"File sharing",
        text:`${emailFrom} shared a file with you`,
        html:require('../services/emailTemp')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${response.uuid}`,
            size:parseInt(file.size/1000) + ' KB',
            expires:'24 hours'
        })
    })

    return res.send({success:true});
})

module.exports=router;