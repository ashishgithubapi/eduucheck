const {Person} = require('../Model/personRegisterModel')

module.exports.Userreg = function(req,res){
    console.log('ashish');

    const user = new Person({
        application_type: req.body.application_type,
        name: req.body.name,
        number:req.body.number,
        email:req.body.email,
        address:req.body.address,
        pincode:req.body.pincode,
        ref_code:req.body.ref_code
        
    })
    user.save();
    console.log(user);
}