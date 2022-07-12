const bcrypt = require('bcrypt');
const _ = require('lodash');
const axios = require('axios');
const otpGenerator = require('otp-generator');
var qs = require("querystring");
var http = require("http");


const {User} = require('../Model/userModel');
const {Otp} = require('../Model/otpModel');
const {UserReg} = require('../Model/userRegister')
const API_KEY = "/API/V1/fda7bc0b-20f9-11e7-929b-00163ef91450";
const MODE_SMS = "SMS";
const TEMPLATE_NAME= "educheck_otp";
module.exports.SignUp = async(req,res)=>{
   var addParms;
   const user = await User.findOne({
    number: req.body.number
    });
    if(user)return res.status(201).send('user already registered');
    const otp_number_genrate = otpGenerator.generate(6,{
        digits:true, upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars:false
    });//otp number random genrate
    console.log("otp number generate"+otp_number_genrate);
    const mobile_number = req.body.number;
    const otp_obj = new Otp({number:mobile_number, otp:otp_number_genrate});//passing a parameter in object model to validate
    const salt  = await bcrypt.genSalt(10);//salt encyption
    var otp_hash = await bcrypt.hash(otp_number_genrate,salt);//Otp salt hash encyption 
    otp_obj.otp = otp_hash;// replaction a normal otp to encypted otp in response
    const result = await otp_obj.save();//response save to db
    //Send SMS Api start
    var options = {
        "method": "GET",
        "hostname": "2factor.in",
        "port": null,
        "path": API_KEY+"/"+MODE_SMS+"/"+mobile_number+"/"+otp_number_genrate+"/"+TEMPLATE_NAME,
        "headers": {
          "content-type": "application/x-www-form-urlencoded"
        }
      };
      var req = http.request(options, function (res) {
      var chunks = [];
      res.on("data", function (chunk) {
          chunks.push(chunk);
      });
      
      res.on("end", function () {
          var body = Buffer.concat(chunks);
        });
      });
      
      req.write(qs.stringify({}));
      req.end();
    
    return res.status(200).json({
      err:false,
      data:[],
        message:"otp send successfully"
    });
    required:true
   

   
}
//
module.exports.verifyOtp = async(req,res)=>{
      const otpHolder = await Otp.find({
        number: req.body.number
      });

      const getUserObject = await UserReg.find({
        number: req.body.number
      });

      console.log("userRegister",getUserObject);
      if(getUserObject.length>0){
      if(getUserObject[0]['is_activate']=="0"){
        return res.status(201).send({
          message:"User is not active, kindly contact admin",
          err:true,
          data:[]
        })
      }
    }
     
    //   console.log(otpHolder+"yeh otp holder hai");
      if(otpHolder.length==0) return res.status(201).send({
        message:"Please enter valid OTP",
        err:true,
        data:[]
      })
      const rightOtpFind = otpHolder[otpHolder.length-1];
    //   console.log(rightOtpFind+"otpfind");
    //   console.log(req.body.otp+" yeh body me otp hai");
      const validUser = await bcrypt.compare( req.body.otp,rightOtpFind.otp);
    //   console.log(validUser+"valid aaya");

      if(rightOtpFind.number===req.body.number && validUser){
        
        const user = new User(_.pick(req.body,['number']));
        const token = user.generateJWT();
       

       let is_register=0;
       let userObject={};
       
       if(getUserObject.length==0){
        userObject = { 'name': '', 'email': '', 'address':'', 'pincode':'','otp':rightOtpFind.otp  };
       }
       else{
        is_register=1;
        
        userObject =getUserObject;
        userObject['otp']=rightOtpFind.otp;
       }
       
        //localStorage.setItem(''+rightOtpFind.number+'', JSON.stringify(userObject));
        


        return res.status(200).send({
            message:"verify otp successful",
            data: getUserObject,
            is_register:is_register,
            err:false

            // token: token,
            // data: result
        });

      } else{
          return res.status(201).send({
            message:"otp was wrong",
            err:true,
            data:[]
          })
      }


}


    // Deconstructs the array field from the
    // input document to output a document
    // for each element

    // module.exports.User_data = function(req,res){
    //   console.log('ashihs');
    //   const person = new Person({
    //     number:"8888888"
    // })
    
    // // console.log(person);

    // return person
    // }

    

    
  

