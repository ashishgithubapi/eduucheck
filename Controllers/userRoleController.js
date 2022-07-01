const {UserRole} = require('../Model/userRoleModel');

module.exports.userRoleList = async(req,res)=>{
   
   try{
        var userRoleLists = await UserRole.find();
   }
   catch(err){
       console.log(err);
   }
    
    
    return res.status(200).json({
        data: userRoleLists,
        err:false,
        message:"Success!!"
    })
}