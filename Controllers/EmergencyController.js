const { UserReg } = require('../Model/userRegister');
const ObjectId = require('mongodb').ObjectId;

const validationUser = async (req,type)=>{
    var id = req.login_user_id;
    //you can now query
    const user = await UserReg.findOne({
        _id: ObjectId(req.login_user_id),
    });
    
    if (typeof user ===undefined) {
        return res.status(401).json({
            data: [],
            err: true,
            message: 'Login User Not exist'
        })
    }
    if(type=="all")
    {
        if (user.number == req.emergency_mobile_no) {
            return res.status(401).json({
                data: [],
                err: true,
                message: 'please enter diff no'
            })
        }
    }
    
    return user;
}

module.exports.addEmergencyContactValidation = async function (req, res) {
   
    //you can now query
    const user = await validationUser(req.body,'all');
    if(Object.keys(user).length>0){
        return res.status(200).json({
            data: [],
            err: false,
            message: 'Kindly Validate Mobile Number'
        })
    }
}


module.exports.EmergencyContact = async function (req, res) {

    //transform your param into an ObjectId
    const user = await validationUser(req.body,"all");
    
    if(Object.keys(user).length>0){
        let userEmergencyData = []
       
        if (user.emergency_contact!='') {
            
            if (user.emergency_contact.trim().length > 0) {
                const userEmergencyList = JSON.parse(user.emergency_contact.trim())
                userEmergencyData = userEmergencyList
                const phoneNo = userEmergencyData[0].mobile_no
                const count = userEmergencyList.length
                if (count > 2) {
                    return res.status(401).json({
                        data: [],
                        err: true,
                        message: 'you are allowed only 3 emergency contact'
                    })
                }
                
                var currentRelationCount = userEmergencyData.reduce(function (n, user) { return n + (user.relation == req.body.emergency_relation); }, 0); 
                console.log("currentRelationCount",currentRelationCount);
                if (currentRelationCount >= 2) {
                    // console.log('you are allowed only 3 emergency contact')
                    return res.status(401).json({
                        data: [],
                        err: true,
                        message: 'select other relation'
                    })
                }

                var currentEmergencyMobileCount = userEmergencyData.reduce(function (n, user) { return n + (user.mobile_no == req.body.emergency_mobile_no); }, 0); 
                console.log("currentEmergencyMobileCount",currentEmergencyMobileCount);
                if (currentEmergencyMobileCount >= 1) {
                    // console.log('you are allowed only 3 emergency contact')
                    return res.status(401).json({
                        data: [],
                        err: true,
                        message: 'This Emergency number is already Used'
                    })
                }
                
            }
        }

        
        
        let emergencyObject = { name: req.body.emergency_name, relation: req.body.emergency_relation, mobile_no: req.body.emergency_mobile_no }

        console.log("emergencyObject",emergencyObject);
        // userEmergencyData.push(emergencyObject)
        userEmergencyData = [...userEmergencyData, emergencyObject]
        const userEmergencyDataString = JSON.stringify(userEmergencyData)
        await UserReg.updateOne({ "_id": ObjectId(req.body.login_user_id )}, { $set: { "emergency_contact": userEmergencyDataString } }, function (err, doc) { console.log("data error" + err); }).clone()
        
        return res.status(200).json({
            data:[],
            err: false,
            message: 'data added successfully'
        })
    }
}

module.exports.getEmergency = async function (req, res) {

    const user = await validationUser(req.body,"single");
    let emergencyData=[]
    
    if(user != null){
        if(user.emergency_contact.trim()!='')
        {
            emergencyData= JSON.parse(user.emergency_contact)
        }
    }
    // console.log(user);
    return res.status(200).json({

        message: "data retrieve success",
        data: emergencyData,
        err: false
    })
}


// module.exports.TestFunction = async function (req, res) {

//    let x = await controller1.SignUp
//    console.log(x);

// //   var y =  x.EmergencyContact

// //   console.log(y);
//     // const user =  await UserReg.find({
//     //     number:req.body.login_mobileno
//     // },{'emergency_contact':true})


//     //  var data =JSON.parse(user[0].emergency_contact)

//     //  var phoneNo = data[0].mobile_no

//     //  console.log(phoneNo);
//     //    const otpnumbergenrate = otp_Generator.generate(6,{
//     //     digits:true, upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars:false
//     // });

//     // // console.log(otpnumbergenerate);

//     //  var options = {
//     //     "method": "POST",
//     //     "hostname": "2factor.in",
//     //     "port": null,
//     //     "path": `/API/V1/fda7bc0b-20f9-11e7-929b-00163ef91450/SMS/${phoneNo}/${otpnumbergenrate}/educheck_otp`,
//     //     "headers": {
//     //       "content-type": "application/x-www-form-urlencoded"
//     //     }
//     //   };


//     //   var req = http.request(options, function (res) {
//     //     var chunks = [];

//     //     res.on("data", function (chunk) {
//     //       chunks.push(chunk);
//     //     });

//     //     res.on("end", function () {
//     //       var body = Buffer.concat(chunks);
//     //       console.log(body.toString());
//     //     });
//     //   });

//     //   req.write(qs.stringify({}));
//     //   req.end();




//     //  console.log(
//     //     valueOfA, valueOfB
//     //   )




//     //  const otpnumbergenrate = otp_Generator.generate(6,{
//     //     digits:true, upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars:false
//     // });


// }


module.exports.deleteEmergencyContact = async function (req, res) {
   const user = await UserReg.find({
        number: req.body.login_mobileno
   })
   var data = JSON.parse(user[0].emergency_contact)
    // console.log(data);
  
   
    

    data.forEach(function(item){ delete item.mobile_no,delete item.name,delete item.relation});

    //  console.log(JSON.stringify(data));

    var ref = JSON.stringify(data)

     await UserReg.updateOne({ "number": req.body.login_mobileno }, { $set: { "emergency_contact": ref } })

     


}