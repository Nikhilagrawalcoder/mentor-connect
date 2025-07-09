const express=require("express");
const cors=require("cors")
const http = require("http");
const app=express();
const server = http.createServer(app);


require("dotenv").config();
const connectDB = require('./config/db');
const { userRoute } = require("./routes/userRoute");
const { bookingRoutes } = require("./routes/bookingRoute");

connectDB();


const path=require('path')

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
     res.send(`Welcome to home route`);
}) 

app.use("/user",userRoute)
app.use("/booking",bookingRoutes)

app.set('view engine','ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));



server.listen(8000,async()=>{
    try { 
        
        console.log("Connected to DB");
        console.log(`Server is runnning at port ${8000}`)
    } catch (error) {
        console.log("Not able to connect to DB");
        console.log(error);
    }
})

