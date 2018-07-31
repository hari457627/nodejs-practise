var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
        name       :   String,
        description     :   String,
        email   :   {type:String,required:true,unique:true},
        phone : {type:String,required:true,unique:true},
        imageURL : {type:String}
    })
    .set('toJSON',{
        virtuals: true,
        versionKey:false,
        transform: function(doc, ret){ delete ret._id }
    });
module.exports = mongoose.model('User', userSchema);