const router = require('express').Router();
const{ SignUp, verifyOtp} = require('../Controllers/userController');
const{Userreg,UserList,UpdateUser} = require('../Controllers/userRegisterController')
const{userRoleList} = require('../Controllers/userRoleController')

const{EmergencyContact, getEmergency, deleteEmergencyContact,addEmergencyContactValidation} = require('../Controllers/EmergencyController')
var cors = require('cors');
router.use(cors()); 

router.route('/registerotp')
.post(SignUp)

router.route('/verifyotp')
.post(verifyOtp)

router.route('/updateUser')
.post(UpdateUser)

router.route('/userreg')
.post(Userreg)

router.route('/getUser')
.get(UserList)

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