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

router.route('/addemergencycontact')
.post(EmergencyContact)

router.route('/getemergencycontact')
.get(getEmergency)

// router.route('/test')
// .post(TestFunction)

// router.route('/userdata')
// .post(User_data)





module.exports = router