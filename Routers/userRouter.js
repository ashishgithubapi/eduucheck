const router = require('express').Router();
const{ SignUp, verifyOtp } = require('../Controllers/userController');
const{Userreg} = require('../Controllers/personController')

router.route('/registerotp')
.post(SignUp)

router.route('/verifyotp')
.post(verifyOtp)

router.route('/userreg')
.post(Userreg)

module.exports = router