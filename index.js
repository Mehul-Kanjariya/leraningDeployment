const express = require("express");
require("dotenv").config();
const {connection} = require("./db")
const userRouter = require("./routes/user.routes")
const {noteRouter} = require("./routes/note.routes")
const {auth}=require("./middleware/auth.middleware")
const cors=require("cors")
const app = express();
app.use(express.json())
app.use(cors())
app.use('/user',userRouter);
app.use(auth);
app.use('/note',noteRouter);
app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("Connected")
    }catch(err){
        console.log(err.message)
    }
    console.log("server is running on port 4500");
})