const jwt = require('jsonwebtoken');
const stripe = require('stripe')('sk_test_51MB02wSCv0ucdq62EclshX0EYSHXvwtFPrmVOnWLqVq4JxFHUvpna0FlVISNhW1FhVors7ReCGVWMem1WPsvbVKG00wJlXiQHS');
const express = require('express');
const router = express.Router();
const mongoose  = require('mongoose');
const {
    verifyToken,
    getUser,
    logout,
  } = require("./user");

require('../DB/db');
const User = require('../models/userSchema');
const Student = require('../models/studentSchema');
const Complain = require('../models/complainSchema');
const Admin = require('../models/adminSchema');

router.get('/', (req,res) =>{
    res.send('Hello User -- from Router');
});

router.post('/addstudent', async (req,res) => {
    const {sname, sregNumber, sroomno} = req.body;
    console.log(sname);


    try{
        const studentExist = await Student.findOne({sregNumber : sregNumber});

            if(studentExist){
                return res.status(200).json({error : "User Already Exists"});
            }
            const student = new Student({sname, sregNumber, sroomno});

            await student.save();
            return res.status(201).json({message : "successfully inserted"});

    } catch (err) {
        console.log(err);
    }
});
router.post('/addcomplain', async (req,res) => {
    const {sname, sregNumber, complaintype, description, sroomno} = req.body;

    try{
            const complain = new Complain({sname, sregNumber, complaintype, description, sroomno});

            await complain.save();
            return res.status(201).json({message : "your complaint has been registered"});

    } catch (err) {
        console.log(err);
    }
});

router.post('/removestudent', async (req,res) => {
    const regNumber = req.body['sregNumber'];
    console.log(regNumber);


    try{
        const userLogin = await Student.findOne({sregNumber : regNumber});
        console.log(userLogin);

        const id = userLogin._id;
        console.log(id);

        if(userLogin){
            Student.deleteOne(  {"_id" :  mongoose.Types.ObjectId(id) } , (err,doc)=> {
                console.log(doc);
                if(err) console.error(err);
                else
                {
                    if(doc)
                    {
                        res.status(200).json({message : "Student removed successfully"})
                    }
                    else
                        res.status(201).json( {message : "Student not exist"})
                }
            })
        }
        else{
            res.status(203).json({error : "User not found"})
        }
    } catch(err){
        console.log(err);
    }
});

router.post('/removecomplain', async (req,res) => {
    const regNumber = req.body['sregNumber'];
    console.log(regNumber);


    try{
        const userLogin = await Complain.findOne({sregNumber : regNumber});
        console.log(userLogin);

        const id = userLogin._id;
        console.log(id);

        if(userLogin){
            Complain.deleteOne(  {"_id" :  mongoose.Types.ObjectId(id) } , (err,doc)=> {
                console.log(doc);
                if(err) console.error(err);
                else
                {
                    if(doc)
                    {
                        res.status(200).json({message : "Complaint resolved successfully"})
                    }
                    else
                        res.status(201).json( {message : "failed"})
                }
            })
        }
        else{
            res.status(203).json({error : "Complaint not found"})
        }
    } catch(err){
        console.log(err);
    }
});

router.get('/getStudents', async (req,res)=>{
    // Note no `await` here
const cursor = Student.find().cursor();
const arr = []
for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  arr.push(doc);
}
    res.send(arr);
});

router.get('/getComplain', async (req,res)=>{
    // Note no `await` here
const cursor = Complain.find().cursor();
const arr = []
for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  arr.push(doc);
}
    res.send(arr);
});

router.post('/register', async (req,res) => {
    const {name, regNumber, email, password, cpassword} = req.body;

    if(!name || !email || !regNumber || !password || !cpassword){
        res.status(202).json({error : "plz fill the field properly"});
    }


    try{
        const userExist = await User.findOne({email:email});

            if(userExist){
                return res.status(200).json({error : "User Already Exists"});
            }
            const user = new User({name, regNumber, email, password, cpassword});

            await user.save();
            return res.status(201).json({message : "Resgistration successfull"});

    } catch (err) {
        console.log(err);
    }
});

router.post('/login', async (req,res) => {
    console.log("hello");
    try{
        const {email, password} = req.body;
        console.log(email,password)
        
        const userLogin = await User.findOne({email : email});
        console.log(userLogin);

        if(userLogin){
            if(password == userLogin.password){
                const token = jwt.sign({id:userLogin._id}, process.env.SECRET_KEY,{
                    expiresIn:"60s"
                })
                console.log("Generated Token\n", token);

                res.cookie(String(userLogin._id), token, {
                  path: "/",
                  expires: new Date(Date.now() + 1000 * 55), // 30 seconds
                  httpOnly: true,
                  sameSite: "lax",
                });
                res.status(201).json({message : "Login successful",user:userLogin , token});
            }
            else{
                res.status(202).json({error : "incorrect password"});
            }
        }
        else{
            res.status(203).json({error : "User not found"})
        }
    } catch(err){
        console.log(err);
    }
});

router.post('/adminlogin', async (req,res) => {
    console.log("hello");
    try{
        const {email, password} = req.body;
        console.log(email,password)
        
        const userLogin = await User.findOne({email : email});
        console.log(userLogin);

        if(userLogin){
            if(password == userLogin.password){
                const token = jwt.sign({id:userLogin._id}, process.env.SECRET_KEY,{
                    expiresIn:"3600s"
                })
                console.log("Generated Token\n", token);

                res.cookie(String(userLogin._id), token, {
                  path: "/",
                  expires: new Date(Date.now() + 1000 * 3000), // 30 seconds
                  httpOnly: true,
                  sameSite: "lax",
                });
                res.status(201).json({message : "Login successful",user:userLogin , token});
            }
            else{
                res.status(202).json({error : "incorrect password"});
            }
        }
        else{
            res.status(203).json({error : "User not found"})
        }
    } catch(err){
        console.log(err);
    }
});

const YOUR_DOMAIN = 'http://localhost:5000';
// router.get('/success', (req,res) => {
//   res.sendFile(path.join(__dirname+'/success.html'));
// })

router.post('/create-checkout-session', async (req, res) => {
    console.log('hello');
    try{
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1MC7wCSCv0ucdq623LvwpFWK',       
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/mess/success`,
      cancel_url: `http://localhost:3000/mess/cancel`,
    });
    res.send(session.url);
   
    // console.log(session.url)
  } catch(err){
      console.log(err)
    }
  });

  
router.get("/user", verifyToken, getUser);
router.post("/logout", verifyToken, logout);
// router.get("/refresh", refreshToken, verifyToken, getUser);
module.exports = router;