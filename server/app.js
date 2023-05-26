const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cors({credentials: true , origin:"http://localhost:3000"}));
app.use(bodyParser.json());
app.use(cookieParser());

// Dotenv
dotenv.config({path: './config.env'});

//import mongodb 
require('./DB/db.js')

app.use(express.json());

// linking the router files
app.use(require('./router/auth'));

//import userSchema
const User = require('./models/userSchema');
const Student = require('./models/studentSchema');

const PORT = process.env.PORT;


// app.get('/', (req, res) => {
//     res.send("Hello User");
// })

app.listen(PORT, ()=>{
    console.log("server is running at",PORT);
})
