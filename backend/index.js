const express=require("express");
const cors=require("cors")

const http = require("http");
require("dotenv").config();
const connectDB = require('./config/db');
const { userRoute } = require("./routes/userRoute");
const { bookingRoutes } = require("./routes/bookingRoute");

connectDB();

const app=express();
const path=require('path')

app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);



app.get("/",(req,res)=>{
     res.send(`Welcome to home route`);
}) 

app.use("/user",userRoute)
app.use("/booking",bookingRoutes)

app.set('view engine','ejs');


app.use(express.static(path.join(__dirname, 'public')));











httpServer.listen(5000,async()=>{
    try { 
        
        console.log("Connected to DB");
        console.log(`Server is runnning at port ${5000}`)
    } catch (error) {
        console.log("Not able to connect to DB");
        console.log(error);
    }
})

