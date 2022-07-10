const {Offers} = require('../Model/offerModel')
const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const path = require('path');
const fs = require('fs');




module.exports.UploadFile = (req,res)=>{
 

const upload = multer({dest:'images/'}).single("name");
upload(req, res, (err) => {
    console.log("req file",req.file);
    console.log("req body",req.body.filename);
    
    if(err) {
      return res.status(400).send("Something went wrong!");
    }
    if(req.file!==undefined){
    console.log("Received file" + req.file.originalname);
    var src = fs.createReadStream(req.file.path);
    var dest = fs.createWriteStream('images/' + req.body.filename);
    src.pipe(dest);
    src.on('end', function() {
    	fs.unlinkSync(req.file.path);
        //res.json('OK: received ' + req.body.filename);
        return res.status(200).json({
            data: req.body.filename,
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


module.exports.ViewOffer = async(req,res)=>{
const offerLists = await Offers.find({offer_status:1},{_id:true,name:true,description:true,offer_date:true,offer_image:true,offer_status:true});
    return res.status(200).json({
        data: offerLists,
        err: false,
        message: ''
    })
}

module.exports.ViewSingleOffer = async(req,res)=>{
    

    const offerLists = await Offers.find({"_id":ObjectId(req.body.id)},{_id:true,name:true,description:true,offer_date:true,offer_image:true,offer_status:true});
        return res.status(200).json({
            data: offerLists,
            err: false,
            message: ''
        })
    }
module.exports.updateOffer = async(req,res)=>{
    console.log("request",req.body);
    let offer_obj = req.body.offer_obj;
    let id = req.body.id;
const updateUser = await Offers.updateOne({ "_id": ObjectId(offer_id )}, { $set: { offer_obj } });
    return res.status(200).json({
        data: req.body,
        err: false,
        message: ''
    })
}



//await UserReg.updateOne({ "_id": ObjectId(req.body.login_user_id )}, { $set: { "emergency_contact": userEmergencyDataString } }, function (err, doc) { console.log("data error" + err); }).clone()
module.exports.addUpdateOffer = async (req,res)=>{

  

   
if(req.body.type=="add"){
    
    
const offer = new Offers({
    name: req.body.name,
    description: req.body.description,
    offer_image: '',
    offer_date:req.body.offer_date,
    offer_status:1
})



await offer.save((err)=>{
    try{
        return res.status(200).json({
            data: req.body,
            err: false,
            message: 'File is uploaded successfully'
        })
    }
    catch(err){
        return res.status(200).json({
            
            data: err,
            err: true,
            message: 'Something is went wrong'
        })
    }
})
}
else if(req.body.type=="update"){
    
    let id = req.body.id;
    let offer_obj={
        name:req.body.name,
        description:req.body.description,
        offer_date:new Date(req.body.offer_date)
    }

   
const updateUser = await Offers.updateOne({"_id": ObjectId(id)}, { $set: offer_obj  });
    return res.status(200).json({
        data: updateUser,
        err: false,
        message: ''
    })
}

}


