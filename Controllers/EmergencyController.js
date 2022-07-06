const { UserReg } = require('../Model/userRegister');
const ObjectId = require('mongodb').ObjectId;

const validationUser = async (res,req,type)=>{
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
    const user = await validationUser(res,req.body,'all');
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
    const user = await validationUser(res,req.body,"all");
    
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

    const user = await validationUser(res,req.body,"single");
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





module.exports.deleteEmergencyContact = async function (req, res) {
    const user = await validationUser(res,req.body,"single");

    if (typeof user ===undefined) {
        return res.status(401).json({
            data: [],
            err: true,
            message: 'Login User Not exist'
        })
    }

    let emergencyData=[]
    
    
    if(user.emergency_contact.trim()!='')
    {
        emergencyData= JSON.parse(user.emergency_contact)
    }
    // console.log(data);
  
   
    
    emergencyData = emergencyData.filter(function( obj ) {
        return obj.mobile_no !== req.body.emergency_mobile_no;
      });

      

      let emergencyDataStringify='';

      if(emergencyData.length>0){
        emergencyDataStringify=JSON.stringify(emergencyData);
      }
    
      
     
     await UserReg.updateOne({ "_id": ObjectId(req.body.login_user_id )}, { $set: { "emergency_contact": emergencyDataStringify } }, function (err, doc) { console.log("data error" + err); }).clone()

     return res.status(200).json({

        message: "data deleted successfully",
        data: emergencyData,
        err: false
    })

     


}