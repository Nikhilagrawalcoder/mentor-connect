const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
require("dotenv").config();
const { Usermodel } = require("../models/userModel");
const {BlacklistToken}=require("../models/blacklistModel");

const userRoute = express.Router();

// Get all mentors
userRoute.get("/mentors", async (req, res) => {
    try {
        let allMentors = await Usermodel.find({ role: "mentor" });
        res.json({ "msg": "All mentor details", "data": allMentors });
    } catch (error) {
        console.log("Error from getting all mentors route", error);
        res.json({ "msg": "Error while getting all mentor details" });
    }
});

// Get mentors according to location
userRoute.get("/mentors/:location", async (req, res) => {
    let location = req.params.location;
    try {
        let allMentors = await Usermodel.find({ role: "mentor", location: { "$regex": location, "$options": "i" } });
        console.log(allMentors);
        res.json({ "msg": "All mentors details based on location", "data": allMentors });
    } catch (error) {
        console.log("Error from getting mentors based on location", error);
        res.json({ "msg": "Error while getting mentors details based on location" });
    }
});

// Get mentors based on their specialty
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

// Route to add new user (mentor/mentee)
userRoute.post("/register", async (req, res) => {
    console.log(req.body);
    const { name, email, password, role, expertise, location, meetLink } = req.body;
    console.log(email);
   try {
        let reqData = await Usermodel.find({ email });
       console.log(reqData);
        if (reqData.length > 0) {
            return res.json({ "msg": "You are already registered" });
        }

        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                console.log("Error from hashing password", err);
                res.json({ "msg": "Error from hashing password" });
            } else {
                // Initialize the meetLink only if the role is 'mentor'
                let userMeetLink = null;
                if (role === "mentor") {
                    userMeetLink = meetLink || "https://meet.google.com/your-default-meet-link"; // Default if no link is provided
                }

                // Create a new user object with the meetLink only if it's a mentor
                let registerData = new Usermodel({ 
                    name, 
                    email, 
                    password: hash, 
                    role, 
                    expertise: expertise || "None", 
                    location, 
                    meetLink:   userMeetLink || null  // Only add meetLink for mentors
                });

                await registerData.save();
                res.json({ "msg": "Successfully registered" });
            }
        });
    } catch (error) {
        console.log("Error from register route", error);
        res.json({ "msg": "Error in registering a user" });
    }
});


// Route to login a user (mentor/mentee)
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

// Route to logout a user (mentor/mentee) 
userRoute.get("/logout", async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({ "msg": "No token provided" });
    }

    try {
        // Check if the token is already blacklisted
        const existingToken = await BlacklistToken.findOne({ token });
        if (existingToken) {
            return res.status(200).json({ "msg": "Token is already blacklisted. Logout Successful." });
        }

        // Create a new blacklist entry
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
