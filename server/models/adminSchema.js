const mongoose = require('mongoose');



const adminSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    }, 
    password : {
        type : String,
        required : true
    }
})
const Admin = mongoose.model('ADMIN', adminSchema);
module.exports = Admin;