const {Schema,model} = require('mongoose');

const screenLockSchema = Schema({
    user_id: String,
    screen_lock_image: String
    
      

});

module.exports.ScreenLockModel = model('screenlock',screenLockSchema)