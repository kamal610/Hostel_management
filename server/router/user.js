const jwt = require('jsonwebtoken');

const User = require('../models/userSchema');

const verifyToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1]
    console.log(token);
    if (!token) {
      res.status(404).json({ message: "No token found" });
    }
    jwt.verify(String(token), process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid TOken" });
      }
      console.log(user.id);
      req.id = user.id;
    });
    next();
  };
  const logout = (req, res, next) => {
    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];
    if (!token) {
      return res.status(400).json({ message: "Couldn't find token" });
    }
    jwt.verify(String(token), process.env.SECRET_KEY, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Authentication failed" });
      }
      res.clearCookie(`${user.id}`);
      req.cookies[`${user.id}`] = "";
      return res.status(200).json({ message: "Successfully Logged Out" });
    });
  };
  const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
      user = await User.findById(userId, "-password -cpassword");
    } catch (err) {
      return new Error(err);
    }
    if (!user) {
      res.status(404).json({ messsage: "User Not FOund" });
      return;
    }
    return res.status(200).json({ user });
  };
  
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.logout = logout;
// exports.refreshToken = refreshToken;