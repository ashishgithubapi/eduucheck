const {ScreenLockModel} = require('../Model/screenLockModel')
const {UserReg} = require('../Model/userRegister')
const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const path = require('path');
const fs = require('fs');




module.exports.AddScreenLock = (req,res)=>{
 

const upload = multer({dest:'screenlocks/'}).single("name");
upload(req, res, (err) => {
    console.log("req file",req.file);
    console.log("req body",req.body.user_id);
    const userExistCount = UserReg.find({_id:Object(req.body.user_id)}).count();
    if(userExistCount==0){
        return res.status(201).json({
            data: userExistCount,
            err: true,
            message: 'The user is not exist'
        })
    }
    const screeLockListsCount = ScreenLockModel.find({user_id:req.body.user_id}).count();
    if(screeLockListsCount==4){
        return res.status(201).json({
            data: screeLockLists,
            err: true,
            message: 'The limit to upload the screen lock is over'
        })
    }
    
    
    if(err) {
      return res.status(400).send("Something went wrong!");
    }
    if(req.file!==undefined){
    console.log("Received file" + req.file.originalname);
    var src = fs.createReadStream(req.file.path);
    var dest = fs.createWriteStream('screenlocks/' + req.file.originalname);
    src.pipe(dest);
    src.on('end', function() {
    	fs.unlinkSync(req.file.path);
        //res.json('OK: received ' + req.body.filename);
        let screenLocks= new ScreenLockModel({
            user_id:req.body.user_id,
            screen_lock_image:req.file.originalname
        })
        screenLocks.save();
        return res.status(200).json({
            data: req.file.originalname,
            err: false,
            message: 'File is uploaded successfully'
        })
    });
    src.on('error', function(err) { return res.status(401).json({
        data: err,
        err: true,
        message: 'Something went wrong.'
    }) 
});
    }

  });

     
    }


module.exports.ViewScreenLock = async(req,res)=>{
const screeLockLists = await ScreenLockModel.find();
    return res.status(200).json({
        data: screeLockLists,
        err: false,
        message: ''
    })
}


module.exports.DeleteScreenLock = async(req,res)=>{
    const screeLockId = req.body.screenLockId;
    const screeLockFindCount = await ScreenLockModel.find({'_id':Object(screeLockId)}).count();
    if(screeLockFindCount==0){
        return res.status(200).json({
            data: [],
            err: true,
            message: 'No Record Found'
        })
    }
    
    const screeLockDelete = await ScreenLockModel.remove({'_id':Object(screeLockId)});
        return res.status(200).json({
            data: screeLockDelete,
            err: false,
            message: 'Deleted Successfully'
        })
    }




