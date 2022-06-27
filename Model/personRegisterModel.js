const {Schema,model} = require('mongoose');

const personSchema = Schema({
    application_type: String,
    name: String,
    password:String,
    number: String,
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    phone: {
        type: String,
        match: /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g

      },

      address:String,
      pincode:Number,
      referalcode:String,
      user_id:String,
      otp:String
});

module.exports.Person = model('Person',personSchema)