const User = require('../models/usersModels');
const express = require('express');
const jwt = require('jsonwebtoken');
const jwt_secret = "tortilla";

const protectedRoutes = express.Router();

protectedRoutes.use((req, res, next) => {
    const token = req.headers.cookie;
    const cookie = token.split("=")

    if (token) {
      jwt.verify(cookie[1], jwt_secret, async (err, decoded) => {
        console.log(decoded);
        let data = await User.getUserByEmail(decoded.email)

        console.log(data);

        if (data[0].logged === true) {
          req.decoded = decoded;
          
          console.log(`LOG: ${req.decoded}`);
          next();   
        } else {
          return res.json({ msg: 'Invalid token' });
        }
      });
    } else {
      res.send({ 
          msg: 'Token not provided' 
      });
    }
 });

module.exports = protectedRoutes;