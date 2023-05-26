const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    sname : {
        type : String,
        required : true
    },
    sregNumber : {
        type : String,
        required : true
    },
    sroomno : {
        type : Number,
        required : true
    }
})


const Student = mongoose.model('Student', studentSchema);


module.exports = Student;