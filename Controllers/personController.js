const {Person} = require('../Model/personRegisterModel')

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




    const user = new Person({
        application_type: req.body.application_type,
        name: req.body.name,
        number:req.body.number,
        email:req.body.email,
        address:req.body.address,
        pincode:req.body.pincode,
        referalcode:req.body.referalcode,
        
        
    })
    //  user.save();
    user.save((err, u) => { console.log('this is user is'+u._id); 
    
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