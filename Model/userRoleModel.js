const {Schema,model} = require('mongoose');

module.exports.UserRole = model('UserRole',Schema({
    role:{
        type: String,
        required:true
    }
}))