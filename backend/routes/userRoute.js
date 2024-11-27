const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const nodemailer = require("nodemailer");
const { Usermodel } = require("../models/userModel");
const {BlacklistToken}=require("../models/blacklistModel");

const userRoute = express.Router();
const transporter = nodemailer.createTransport({
            pool: true,
             host: 'smtp.gmail.com',
    port: 587, 
    secure: false, 
            auth: {
                user: process.env.EMAIL_USER,      
        pass: process.env.EMAIL_PASS 
        }});


userRoute.get("/mentors", async (req, res) => {
    try {
        let allMentors = await Usermodel.find({ role: "mentor" });
        res.json({ "msg": "All mentor details", "data": allMentors });
    } catch (error) {
        console.log("Error from getting all mentors route", error);
        res.json({ "msg": "Error while getting all mentor details" });
    }
});

userRoute.get("/mentors/:location", async (req, res) => {
    let location = req.params.location;
    try {
        let allMentors = await Usermodel.find({ role: "mentor", location: { "$regex": location, "$options": "i" } });
        // console.log(allMentors);
        res.json({ "msg": "All mentors details based on location", "data": allMentors });
    } catch (error) {
        console.log("Error from getting mentors based on location", error);
        res.json({ "msg": "Error while getting mentors details based on location" });
    }
});


userRoute.get("/mentors/expertise/:value", async (req, res) => {
    let expertise = req.params.value;
    try {
        let allMentors = await Usermodel.find({ role: "mentor", expertise });
        res.json({ "msg": "All mentors details based on expertise", "data": allMentors });
    } catch (error) {
        console.log("Error from getting mentors based on expertise", error);
        res.json({ "msg": "Error while getting mentors details based on expertise" });
    }
});


userRoute.post("/register", async (req, res) => {
   
    const { name, email, password, role, expertise, location, meetLink } = req.body;
  
   try {
        let reqData = await Usermodel.find({ email });
    
        if (reqData.length > 0) {
            return res.json({ "msg": "You are already registered" });
        }

        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                console.log("Error from hashing password", err);
                res.json({ "msg": "Error from hashing password" });
            } else {
                
                let userMeetLink = null;
                if (role === "mentor") {
                    userMeetLink = meetLink || "https://meet.google.com/your-default-meet-link"; // Default 
                }

        
                let registerData = new Usermodel({ 
                    name, 
                    email, 
                    password: hash, 
                    role, 
                    expertise: expertise || "None", 
                    location, 
                    meetLink:   userMeetLink || null  
                });

                await registerData.save();
                 const mailOptions = {
                    from: 'nikhilagrawal0605@gmail.com',
                    to: email,
                    subject: 'Registration Confirmation',
                    text: `Hello ${name},\n\nThank you for registering. We're excited to have you on board!`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Error sending email:", error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.json({ "msg": "Successfully registered" });
            }
        });
    } catch (error) {
        console.log("Error from register route", error);
        res.json({ "msg": "Error in registering a user" });
    }
});



userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        let reqData = await Usermodel.find({ email });
        if (reqData.length == 0) {
            return res.json({ "msg": "Please register first" });
        } else {
            bcrypt.compare(password, reqData[0].password, async (err, result) => {
                if (result) {
                    let token = jwt.sign({ userId: reqData[0]._id, role: reqData[0].role, email: reqData[0].email }, process.env.Key);
                    res.json({ "msg": "Login Success", "token": token, "role": reqData[0].role, "name": reqData[0].name });
                } else {
                    res.json({ "msg": "Wrong Credentials" });
                }
            });
        }

    } catch (error) {
        console.log("Error from login route", error);
        res.json({ "msg": "Error in logging in a user" });
    }
});


userRoute.get("/logout", async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({ "msg": "No token provided" });
    }

    try {
       
        const existingToken = await BlacklistToken.findOne({ token });
        if (existingToken) {
            return res.status(200).json({ "msg": "Token is already blacklisted. Logout Successful." });
        }

     
        const newBlacklistToken = new BlacklistToken({ token });
        await newBlacklistToken.save();

        res.json({ "msg": "Logout Successful" });
    } catch (error) {
        console.log("Error from logout route", error);
        res.status(500).json({ "msg": "Error while logging out" });
    }
});


module.exports = {
    userRoute
};
