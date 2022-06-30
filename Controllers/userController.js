const bcrypt = require('bcrypt');
const _ = require('lodash');
const axios = require('axios');
const otpGenerator = require('otp-generator');
var qs = require("querystring");
var http = require("http");


const {User} = require('../Model/userModel');
const {Otp} = require('../Model/otpModel');
// const {Person} = require('../Model/userRegister')
const API_KEY = "/API/V1/fda7bc0b-20f9-11e7-929b-00163ef91450";
const MODE_SMS = "SMS";
const TEMPLATE_NAME= "educheck_otp";
module.exports.SignUp = async(req,res)=>{
  

   var addParms;

   const user = await User.findOne({
    number: req.body.number
});
   

    if(user)return res.status(400).send('user already registered');
    //var OTP = "123456";
    const otp_number_genrate = otpGenerator.generate(6,{
        digits:true, upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars:false
    });//otp number random genrate

    const mobile_number = req.body.number;
    // const otp_set = generate_otp(mobile_number);
    // return res.status(200).json({
    //     message:"otp send successfully"
    // });
    
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
          console.log(body.toString());
          console.log(body.toString());

        });
      });
      
      req.write(qs.stringify({}));
      req.end();
    console.log(res);
    return res.status(200).json({
        message:"otp send successfully"
    });
    required:true
   

   
}
//
module.exports.verifyOtp = async(req,res)=>{
      const otpHolder = await Otp.find({
        number: req.body.number
      });

     
    //   console.log(otpHolder+"yeh otp holder hai");
      if(otpHolder.length==0) return res.status(400).send('please enter the proper otp')
      const rightOtpFind = otpHolder[otpHolder.length-1];
    //   console.log(rightOtpFind+"otpfind");
    //   console.log(req.body.otp+" yeh body me otp hai");
      const validUser = await bcrypt.compare( req.body.otp,rightOtpFind.otp);
    //   console.log(validUser+"valid aaya");

      if(rightOtpFind.number===req.body.number && validUser){
        
        const user = new User(_.pick(req.body,['number']));
        const token = user.generateJWT();
        // const result = await user.save();
        // const OTPDelete = await Otp.deleteMany({
        //     number: rightOtpFind.number
        // });
       
        if (typeof localStorage === "undefined" || localStorage === null) {
          var LocalStorage = require('node-localstorage').LocalStorage;
          localStorage = new LocalStorage('./scratch');
       }

       
       var getUserObject = JSON.parse(localStorage.getItem(''+rightOtpFind.number+''));
       console.log("data",JSON.stringify(getUserObject))
       if(getUserObject==null){
        var userObject = { 'name': '', 'email': '', 'address':'', 'pincode':'','otp':rightOtpFind.otp  };
        localStorage.setItem(''+rightOtpFind.number+'', JSON.stringify(userObject));
       }
       else{
        var userObject =getUserObject;
        userObject['otp']=rightOtpFind.otp;
        localStorage.setItem(''+rightOtpFind.number+'', JSON.stringify(userObject));
       }
       
        //localStorage.setItem(''+rightOtpFind.number+'', JSON.stringify(userObject));
        


        return res.status(200).send({
            message:"verify otp successful",
            data: getUserObject

            // token: token,
            // data: result
        });

      } else{
          return res.status(400).send({
            message:"otp was wrong"
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

    

    
  

