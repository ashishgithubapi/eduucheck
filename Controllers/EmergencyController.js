const { UserReg } = require('../Model/userRegister');


// const _ = require('lodash');
// const axios = require('axios');
// const otp_Generator = require('otp-generator');
// var qs = require("querystring");
// var http = require("http");

// const{ SignUp} = require('../Controllers/userController');

module.exports.EmergencyContact = async function (req, res) {
    const ObjectId = require('mongodb').ObjectId;

    //transform your param into an ObjectId
    var id = req.params.user_id;
    var good_id = new ObjectId(id);
    console.log("this is user" + good_id);

    //you can now query
    const user = await UserReg.find({
        number: req.body.login_mobileno,
        // _id:"123"


    })


    if (!user) {
        console.log('user not exist');
    }


    else if (user[0].number == req.body.mobile_no) {
        console.log('please enter diff no');
    }

    let userEmergencyData = []
    if (user[0].emergency_contact) {


        if (user[0].emergency_contact.trim().length > 0) {
            const userEmergencyList = JSON.parse(user[0].emergency_contact.trim())
            userEmergencyData = userEmergencyList
            const phoneNo = userEmergencyData[0].mobile_no
            console.log(phoneNo);

           
           


            const count = userEmergencyList.length

            if (count > 2) {

                // console.log('you are allowed only 3 emergency contact')
                return res.status(200).json({
                    data: [],
                    err: true,
                    message: 'you are allowed only 3 emergency contact'
                })
            }
            else {
                var currentRelationCount = userEmergencyData.reduce(function (n, user) { return n + (user.relation == req.body.relation); }, 0); console.log(currentRelationCount);


                if (currentRelationCount >= 2) {

                    // console.log('you are allowed only 3 emergency contact')
                    return res.status(200).json({
                        data: [],
                        err: true,
                        message: 'select other relation'
                    })
                }
            }


        }

    }

    let emergencyObject = { name: req.body.name, relation: req.body.relation, mobile_no: req.body.mobile_no }

    // userEmergencyData.push(emergencyObject)
    userEmergencyData = [...userEmergencyData, emergencyObject]

    const userEmergencyDataString = JSON.stringify(userEmergencyData)
    // console.log("yessssss"+userEmergencyData,userEmergencyDataString);

     
    await UserReg.updateOne({ "number": req.body.login_mobileno }, { $set: { "emergency_contact": userEmergencyDataString } }, function (err, doc) { console.log("data error" + err); }).clone()


    return res.status(200).json({

        err: false,
        message: 'data added successfully'
    })



}
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
module.exports.getEmergency = async function (req, res) {
    const user = await UserReg.find({
        number: req.body.login_mobileno
    }, { 'emergency_contact': true })

    // console.log(user);
    return res.status(200).json({

        message: "data retrieve success",
        data: JSON.parse(user[0].emergency_contact),
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