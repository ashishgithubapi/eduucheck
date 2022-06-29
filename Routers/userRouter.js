const router = require('express').Router();
const{ SignUp, verifyOtp} = require('../Controllers/userController');
const{Userreg} = require('../Controllers/userRegisterController')

const{EmergencyContact, getEmergency} = require('../Controllers/EmergencyController')

router.route('/registerotp')
.post(SignUp)

router.route('/verifyotp')
.post(verifyOtp)

router.route('/userreg')
.post(Userreg)

router.route('/addemergencyContact')
.post(EmergencyContact)

router.route('/getemergencyContact')
.get(getEmergency)

// router.route('/userdata')
// .post(User_data)





module.exports = router