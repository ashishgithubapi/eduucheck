const router = require('express').Router();
const{ ViewOffer, addUpdateOffer,ViewSingleOffer} = require('../Controllers/offerController');


var cors = require('cors');
router.use(cors()); 

router.route('/viewOffer')
.get(ViewOffer)

router.route('/viewSingleOffer')
.post(ViewSingleOffer)



router.route('/addUpdateOffer')
.post(addUpdateOffer)





module.exports = router