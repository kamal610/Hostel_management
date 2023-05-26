const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
    sname : {
        type : String,
        required : true
    },
    sregNumber : {
        type : String,
        required : true
    },
    complaintype : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    sroomno : {
        type : Number,
        required : true
    }

})


const Complain = mongoose.model('Complain', complainSchema);


module.exports = Complain;