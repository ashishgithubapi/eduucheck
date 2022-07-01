const router = require('express').Router();
const{ SignUp, verifyOtp} = require('../Controllers/userController');
const{Userreg} = require('../Controllers/userRegisterController')
const{userRoleList} = require('../Controllers/userRoleController')

const{EmergencyContact, getEmergency, deleteEmergencyContact,addEmergencyContactValidation} = require('../Controllers/EmergencyController')

router.route('/registerotp')
.post(SignUp)

router.route('/verifyotp')
.post(verifyOtp)

router.route('/userreg')
.post(Userreg)

router.route('/addEmergencyContactValidation')
.post(addEmergencyContactValidation)

router.route('/addemergencycontact')
.post(EmergencyContact)

router.route('/getemergencycontact')
.post(getEmergency)

router.route('/deleteemergencycontact')
.delete(deleteEmergencyContact)

router.route('/getUserRole')
.get(userRoleList)

// router.route('/test')
// .post(TestFunction)

// router.route('/userdata')
// .post(User_data)





module.exports = router