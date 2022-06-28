const { Person } = require('../Model/personRegisterModel');

module.exports.EmergencyContact = async function (req, res) {
    const ObjectId = require('mongodb').ObjectId;

    //transform your param into an ObjectId
    var id = req.params.user_id;
    var good_id = new ObjectId(id);
    console.log("this is user" + good_id);

    //you can now query
    const user = await Person.find({
        number: req.body.login_mobileno,
        // _id:"123"


    })

    console.log(user[0].number);
    console.log(req.body.mobile_no);


    if (!user) {
        console.log('user not exist');
    }


    else if (user[0].number == req.body.mobile_no) {
        console.log('please enter diff no');
    }

    let userEmergencyData = []
    if (user.emergency_contact) {

        if (user.emergency_contact.trim().length > 0) {
            const userEmergencyList = JSON.parse(user.emergency_contact.trim())
            userEmergencyData = userEmergencyList
            const count = userEmergencyList.length
            if (count > 2) {

                console.log('you are allowed only 3 emergency contact')
            }
            else {
                console.log('relation validation')
            }

        }

    }

    let emergencyObject = { name: req.body.name, realtion: req.body.relation, mobile_no: req.body.mobile_no }

    userEmergencyData.push(emergencyObject)

    const userEmergencyDataString = JSON.stringify(userEmergencyData)
    console.log("yessssss"+userEmergencyData,userEmergencyDataString);

   await  Person.updateOne( {"number": req.body.mobile_no}, {$set : { "emergency_contact" : userEmergencyDataString }} )

}
