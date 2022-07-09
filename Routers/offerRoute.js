const router = require('express').Router();
const{ ViewOffer, updateOffer,addOffer} = require('../Controllers/offerController');

var cors = require('cors');
router.use(cors()); 

router.route('/viewOffer')
.get(ViewOffer)

router.route('/updateOffer')
.post(updateOffer)

router.route('/addOffer')
.post(addOffer)





module.exports = router