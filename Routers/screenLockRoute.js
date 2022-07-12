const router = require('express').Router();
const{ ViewScreenLock, AddScreenLock,DeleteScreenLock} = require('../Controllers/screenLockController');


var cors = require('cors');
router.use(cors()); 

router.route('/viewScreenLock/:user_id')
.get(ViewScreenLock)

router.route('/addScreenLock')
.post(AddScreenLock)

router.route('/deleteScreenLock')
.post(DeleteScreenLock)





module.exports = router