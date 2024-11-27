const express = require("express");
const { Bookingmodel } = require("../models/bookingModel");
const { authentication } = require("../middlewares/authenticationMiddleware");
const {authorisation}=require("../middlewares/authorizationMiddleware");
const bookingRoutes = express.Router();
const nodemailer = require("nodemailer");
const { Usermodel } = require("../models/userModel");

require("dotenv").config()
  
const transporter = nodemailer.createTransport({
            pool: true,
             host: 'smtp.gmail.com',
    port: 587, 
    secure: false, 
            auth: {
                user: process.env.EMAIL_USER,      
        pass: process.env.EMAIL_PASS 
        }});


bookingRoutes.get("/paticularUser", authentication,authorisation(["mentee","mentor"]),async (req, res) => {
    let userId = req.body.userId;
    let role=req.body.role;
    
    try {
        if(role==="mentee"){
            const reqData = await Bookingmodel.find({ userId });
            // console.log(reqData);
            res.json({" msg": `All booking data of userId ${userId}`, "Data": reqData })
        }else{
            const reqData = await Bookingmodel.find({ mentorId:userId });
            // console.log(reqData);
            res.json({" msg": `All booking data of userId ${userId}`, "Data": reqData })
        }
        
    } catch (error) {
        console.log("error from getting paticular user booking data", error.message);
        res.json({ "msg": "error in getting paticular user booking data", "errorMsg": error.message })
    }
})




bookingRoutes.post("/create", authentication, authorisation(["mentee"]), async (req, res) => {
    const data = req.body;

    try {
        
        const mentor = await Usermodel.findById(data.mentorId);
        if (!mentor) {
            return res.status(404).json({ "msg": "Mentor not found." });
        }

        
        data.mentorEmail = mentor.email;
        
        data.meetlink = mentor.meetLink;

        let allBookings = await Bookingmodel.find({ mentorId: data.mentorId });
        if (allBookings.length === 0) {
            const addData = new Bookingmodel(data);
            await addData.save();
        } else {
            for (let i = 0; i < allBookings.length; i++) {
                if (allBookings[i].bookingDate === data.bookingDate && allBookings[i].bookingSlot === data.bookingSlot) {
                    return res.json({ "msg": "This Slot is Not Available." });
                }
            }
            const addData = new Bookingmodel(data);
            await addData.save();
        }

       
        const mailOptions = {
            from: 'nikhilagrawal0605@gmail.com',
            to: `${data.userEmail}`,
            cc: `${mentor.email}`,  
            subject: 'Booking Confirmation from Mentor Connect',
            text: `Hello,\n\nYour booking is confirmed with ${mentor.name} on ${data.bookingDate} at ${data.bookingSlot}.\n\nThank you for using our service!\n\nYour meeting link ${data.meetlink}`
        };

       
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ "msg": 'Error while sending confirmation mail' });
            } else {
                return res.status(200).json({
                    "msg": "New booking created successfully. Confirmation sent to email.",
                    "bookingDetails": data
                });
            }
        });

    } catch (error) {
        console.log("Error from adding new booking data", error.message);
        res.status(500).json({ msg: "Error in adding new booking data", "errorMsg": error.message });
    }
});








bookingRoutes.delete("/remove/:id", authentication, authorisation(["mentor"]), async (req, res) => {
    const ID = req.params.id;

    try {
       
        let reqData = await Bookingmodel.findById(ID);
        if (!reqData) {
            return res.status(404).json({ "msg": "Booking not found." });
        }

     
        const mentor = await Usermodel.findById(reqData.mentorId);
        if (!mentor) {
            return res.status(404).json({ "msg": "Mentor associated with booking not found." });
        }

        let specificDate = new Date(`${reqData.bookingDate}`);
        let currentDate = new Date();

        if (currentDate > specificDate) {
            return res.json({ "msg": "Meeting Already Over" });
        } else {
            let timeDiff = Math.abs(currentDate.getTime() - specificDate.getTime());
            let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysDiff >= 1) {
                
                await Bookingmodel.findByIdAndDelete(ID);

                const mailOptions = {
                    from: 'nikhilagrawal0605@gmail.com',
                    to: `${reqData.userEmail}`,    
                    cc: `${mentor.email}`,          
                    subject: 'Booking Cancellation from Mentor Connect',
                    text: `Hello,\n\nYour booking with ${mentor.name} on ${reqData.bookingDate} at ${reqData.bookingSlot} has been successfully canceled.\n\nThank you for using our service!`
                };

               
                let emailSent = false;
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error while sending email:', error);
                        emailSent = false;
                    } else {
                        console.log('Cancellation email sent: ' + info.response);
                        emailSent = true;
                    }

                  
                    res.json({
                        "msg": `Booking ID of ${ID} is deleted successfully.`,
                        "emailStatus": emailSent ? "Email sent successfully" : "Failed to send email"
                    });
                });
            } else {
                return res.json({ "msg": "Our cancellation policy requires a minimum one-day notice for booking deletions." });
            }
        }

    } catch (error) {
        console.log("Error from deleting booking data:", error.message);
        res.status(500).json({ "msg": "Error in deleting booking data", "errorMsg": error.message });
    }
});

bookingRoutes.get("/check-bookings/:id", async (req, res) => {
    try {
       
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; 
        const currentHour = now.getHours(); 

        
        const bookingId = req.params.id;

        
        const booking = await Bookingmodel.findById(bookingId);
        
        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

       
        if(booking.bookingDate<currentDate){
            return res.status(200).json({
                message: "Meeting time has passed",
                booking,
            });
        }
        else if (booking.bookingDate === currentDate) {
            const [startHour, endHour] = booking.bookingSlot.split('-').map(Number);

         
            if (currentHour < startHour) {
                return res.status(200).json({
                    message: "Meeting time hasn't arrived yet",
                    booking,
                });
            }

            
            if (currentHour >= startHour && currentHour < endHour) {
                return res.status(200).json({
                    message: "Meeting is currently valid",
                    booking,
                });
            }

            
            return res.status(200).json({
                message: "Meeting time has passed",
                booking,
            });
        } else {
            
            return res.status(200).json({
                message: "Booking is not scheduled for today",
                booking,
            });
        }
    } catch (error) {
        console.error("Error checking bookings:", error);
        return res.status(500).json({ message: "Server error", error });
    }
});


module.exports = {
    bookingRoutes
}
