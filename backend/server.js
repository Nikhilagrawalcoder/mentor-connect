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

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:5500'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/",(req,res)=>{
     res.send(`Welcome to Mentor Connect API`);
}) 

app.use("/user",userRoute)
app.use("/booking",bookingRoutes)

app.set('view engine','ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8000;

server.listen(PORT,async()=>{
    try { 
        console.log("Connected to DB");
        console.log(`Server is running at port ${PORT}`)
    } catch (error) {
        console.log("Not able to connect to DB");
        console.log(error);
    }
})

