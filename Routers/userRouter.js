const router = require('express').Router();
const{ SignUp, verifyOtp} = require('../Controllers/userController');
const{Userreg} = require('../Controllers/personController')

const{EmergencyContact, getEmergency} = require('../Controllers/EmergencyController')

router.route('/registerotp')
.post(SignUp)

router.route('/verifyotp')
.post(verifyOtp)

router.route('/userreg')
.post(Userreg)

router.route('/emergency')
.post(EmergencyContact)

router.route('/getemergency')
.get(getEmergency)

// router.route('/userdata')
// .post(User_data)





module.exports = router