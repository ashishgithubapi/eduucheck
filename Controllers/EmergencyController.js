const { UserReg } = require('../Model/userRegister');

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

    // console.log(user[0].number);
    console.log(req.body.mobile_no);


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
            const count = userEmergencyList.length
           
            if (count > 2) {

                // console.log('you are allowed only 3 emergency contact')
                return res.send({
                    data:[],
                    err:true,
                    message:'you are allowed only 3 emergency contact'
                })
            }
            else {
                var currentRelationCount = userEmergencyData.reduce(function (n, user) { return n + (user.relation == req.body.relation); }, 0); console.log(currentRelationCount);
              
               
                if (currentRelationCount >= 2) {

                    // console.log('you are allowed only 3 emergency contact')
                    return res.send({
                        data:[],
                        err:true,
                        message:'select other relation'
                    })
                }
            }
        

        }

    }

    let emergencyObject = { name: req.body.name, relation: req.body.relation, mobile_no: req.body.mobile_no }

    // userEmergencyData.push(emergencyObject)
    userEmergencyData = [...userEmergencyData,emergencyObject]

    const userEmergencyDataString = JSON.stringify(userEmergencyData)
    // console.log("yessssss"+userEmergencyData,userEmergencyDataString);
    

   await  UserReg.updateOne( {"number": req.body.login_mobileno}, {$set : { "emergency_contact" : userEmergencyDataString }},function(err,doc){console.log("data error"+err);} ).clone()

  return res.send({
    
    err:false,
    message:'data added successfully'
})

}
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
 }
module.exports.getEmergency = async function(req,res){
    const user =  await UserReg.find({
        number:req.body.login_mobileno
    },{'emergency_contact':true})

    // console.log(user);
    res.send({
        
        message:"data retrieve success",
        data:JSON.parse(user[0].emergency_contact),
        err:false
    })
}
