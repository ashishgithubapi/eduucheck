const {Schema,model} = require('mongoose');

const offerSchema = Schema({
    name: String,
    description:String,
    offer_image: String,
    offer_date:Date,
    offer_status:Number
    
      

});

module.exports.Offers = model('Offer',offerSchema)