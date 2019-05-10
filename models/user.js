const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = Schema({
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    }
}) 
userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }
   
module.exports = mongoose.model('user',userSchema)