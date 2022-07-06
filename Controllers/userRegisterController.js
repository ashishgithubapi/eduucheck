const {UserReg} = require('../Model/userRegister')
const {UserRole} = require('../Model/userRoleModel')
const Jimp = require("jimp"); const fs = require("fs");
const {User} = require('../Model/userModel');
const {Otp} = require('../Model/otpModel');
const ObjectId = require('mongodb').ObjectId;
const crypto = require('crypto');

const referralCodeGenerate = async (len,userNumber) => {
    const generatedCode =  await crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len).toUpperCase();   // return required number of characters
        const referralCodeCount = await UserReg.countDocuments({
            referalcode:generatedCode
       });
       console.log("generatedCode",generatedCode);
       console.log("referralCodeCount",referralCodeCount);
       if(referralCodeCount==0){
            return generatedCode;
       }
       else{
        await referralCodeGenerate(6,userNumber);
       }
}

module.exports.UploadFile = async(req,res)=>{
    //console.log("33");
    const imageData = req.body.data;
   //console.log("44");
// Convert base64 to buffer => <Buffer ff d8 ff db 00 43 00 ...
const buffer = Buffer.from(imageData, "base64");
//console.log("55");
Jimp.read(buffer, (err, res) => {
    //console.log("66");
    //console.log("err",err);
    //console.log("res",res);
  if (err) return  res.status(401).json({err:err});;
  //console.log("77");
  res.quality(5).write("./images/"+req.body.imageName+"");
  
});
console.log("88");
return res.status(200).json({msg:'success'});
    }


module.exports.UserList = async(req,res)=>{
const userLists = await UserReg.find({},{_id:true,name:true,number:true,address:true,email:true,is_activate:true,gst_filename:true,doc_filename:true,referral_count:true,referalcode:true,points:true,payment_status:true});
    return res.status(200).json({
        data: userLists,
        err: false,
        message: ''
    })
}
module.exports.UpdateUser = async(req,res)=>{
    console.log("request",req.body);
const updateUser = await UserReg.updateOne({ "_id": ObjectId(req.body.login_user_id )}, { $set: { "is_activate": req.body.is_activate } });
    return res.status(200).json({
        data: req.body,
        err: false,
        message: ''
    })
}

//await UserReg.updateOne({ "_id": ObjectId(req.body.login_user_id )}, { $set: { "emergency_contact": userEmergencyDataString } }, function (err, doc) { console.log("data error" + err); }).clone()
module.exports.Userreg = async(req,res)=>{
   
    /*if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
     }*/
    let gst_base64data_image = '';
    let doc_base64data_image = '';
    if('gst_base64data' in req.body){
        if(req.body.gst_base64data.length>0){
            var data = req.body.gst_base64data; // Convert base64 to buffer => <Buffer ff d8 ff db 00 43 00 ...
            const buffer = Buffer.from(data, "base64"); 
            gst_base64data_image=req.body.number+'_'+gst_base64data_image;
            Jimp.read(buffer, (err, res) => {if (err) res.status(401).json({err:err}); 
                res.quality(5).write("./images/"+gst_base64data_image+""); });  
                
        }
    }
    if('doc_base64data' in req.body){
        if(req.body.doc_base64data.length>0){
            var data = req.body.doc_base64data; // Convert base64 to buffer => <Buffer ff d8 ff db 00 43 00 ... 
            const buffer = Buffer.from(data, "base64"); 
            doc_base64data_image=req.body.number+'_'+req.body.doc_filename;
            Jimp.read(buffer, (err, res) => { 
                if (err) res.status(401).json({err:err}); 
                res.quality(5).write("./images/"+doc_base64data_image+""); });
            
        }
    }
   

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (!req.body.email.match(validRegex)) {
        return res.status(401).json({
            data: [],
            err: true,
            message: 'Invalid Email address'
        })
    }

    if (/^\d{10}$/.test(parseInt(req.body.number))==false) {
        return res.status(401).json({
            data: [],
            err: true,
            message: 'Invalid Mobile Number'
        })
    }
    console.log(req.body.email);
    console.log(req.body.number);
    
    const emailOrMobileNoExist = await UserReg.find({
         $or : [{email:req.body.email},{number:req.body.number}]
    }).count();

    let points = 100;
    console.log("i m here points");
    const referralCodeGet = await referralCodeGenerate(6,req.body.number);
    console.log("i m here points2");
    const referralCodeRecord = await UserReg.findOne({
        referalcode:req.body.referalcode
   },{_id:true,points:true,referral_count:true});
   
   if(referralCodeRecord){
        points=50;
   }

    const userRoleList = await UserRole.findOne({_id : Object(req.body.application_type)},{role:true});
    console.log(emailOrMobileNoExist);
    if(emailOrMobileNoExist>0){
        return res.status(401).json({
            data: [],
            err: true,
            message: 'Either mobile number of email id is exist'
        })
    }
    

    
    console.log("here1");

    const otpHolderCount = await Otp.find({
        number: req.body.number
      }).count();

      if(otpHolderCount==0){
        return res.status(401).json({
            data: [],
            err: true,
            message: 'Mobile number is not exist IN OTP, Kindly Generate and Verify OTP'
        })
      }
      
      console.log("here2");
    console.log("sdfdfdsfsfs",emailOrMobileNoExist);
    const user = new UserReg({
        application_type: userRoleList.role,
        application_type_id: userRoleList._id,
        name: req.body.name,
        number:req.body.number,
        email:req.body.email,
        address:req.body.address,
        pincode:req.body.pincode,
        referalcode:referralCodeGet,
        gst_filename:gst_base64data_image,
        doc_filename:doc_base64data_image,
        emergency_contact:"",
        is_activate:"0",
        points:points,
        payment_status:0,
        referral_count:0
        
        
    })
    console.log("here3");
    //  user.save();
    await user.save();
    
    if(referralCodeRecord){
        console.log("here5");
    let sharePoints = referralCodeRecord['points']+points;
    let referralCodeCount = referralCodeRecord['referral_count']+1;
    await UserReg.updateOne({ "_id": ObjectId(referralCodeRecord['_id'] )}, { $set: { "points": sharePoints,"referral_count":referralCodeCount } });
    }
    console.log("here4");
    return res.status(200).json({
        data: user,
        err:false,
        message:"Successfully registered!!"
    })
}


module.exports.sendEmail = function(req,res){
    console.log('send mail successfully');

    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'ashish.trrev@gmail.com',
            pass:'sulrexgglwseqxqg'
        }
    })

    var mailOptions = {
        from:'ashish.trrev@gmail.com',
        to:'am5932809@gmail.com',
        subject:'email is there',
        text:'helllloloooooo'
    }

    transporter.sendMail(mailOptions,function(err,info){
        if(err){
            console.log(err);
        }

        else{
            console.log('email sent'+info.response);
        }
    })
}