const {Person} = require('../Model/personRegisterModel')
const Jimp = require("jimp"); const fs = require("fs");

module.exports.Userreg = function(req,res){
    console.log('ashish');
    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
     }

    //  console.log(req.body);
      //localStorage.setItem(''+rightOtpFind.number+'', JSON.stringify(userObject));
      var getUserObject = localStorage.getItem(''+req.body.number+'');
    /*console.log(req.body.number);
    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
      }
    var getUserObject = localStorage.geItem(''+req.body.number+'');*/

    // console.log('retrievedObject: ', JSON.parse(getUserObject))



    if(req.body.gst_base64data.length>0){
        var data = req.body.gst_base64data; // Convert base64 to buffer => <Buffer ff d8 ff db 00 43 00 ... 
      
        const buffer = Buffer.from(data, "base64"); 
        Jimp.read(buffer, (err, res2) => {if (err) throw new Error(err); res2.quality(100).write(__dirname +'/' +req.body.gst_filename); });
  
        
    }
    if(req.body.doc_base64data.length>0){
        var data = req.body.doc_base64data; // Convert base64 to buffer => <Buffer ff d8 ff db 00 43 00 ... 
      
        const buffer = Buffer.from(data, "base64"); 
        Jimp.read(buffer, (err, res) => { if (err) throw new Error(err); res.quality(100).write(__dirname +'/' +req.body.doc_filename); });
  
       
    }

    const user = new Person({
        application_type: req.body.application_type,
        name: req.body.name,
        number:req.body.number,
        email:req.body.email,
        address:req.body.address,
        pincode:req.body.pincode,
        referalcode:req.body.referalcode,
        gst_filename:req.body.gst_filename,
        doc_filename:req.body.doc_filename
        
        
    })
    //  user.save();
    user.save((err, u) => { 
        console.log("what is u??"+u); 
        console.log(err);
    
        const userObject =   {
            application_type: req.body.application_type,
            name: req.body.name,
            number:req.body.number,
            email:req.body.email,
            address:req.body.address,
            pincode:req.body.pincode,
            referalcode:req.body.referalcode,
            otp:getUserObject.otp,
            user_id:u._id
            
        }
        localStorage.setItem(''+req.body.number+'', JSON.stringify(userObject));

        // console.log('this is user id'+user['_id']);
        //var getUserObject = localStorage.geItem(''+req.body.number+'');
        console.log('retrievedObject: ', JSON.stringify(userObject))
    
    });

    

   res.send(user)
     
    console.log(user);
}