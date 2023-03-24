const express = require("express")
const noteRouter = express.Router()
const {NoteModel} = require("../model/note.model")
const jwt = require("jsonwebtoken")

noteRouter.get("/",async(req, res)=>{
    const token=req.headers.authorization
    const decoded=jwt.verify(token,'masai')
    try{
        if(decoded){
            const note = await NoteModel.find({"userID":decoded.userID});
            res.status(200).send(note)
        }else{
            res.status(400).send({"message":"No notes"})
        }
    }catch(err){
        res.status(400).send({"message":err.message})
    }
})

noteRouter.post("/add",async(req, res)=>{ 
    try{
        const note = new NoteModel(req.body);
        await note.save();
        res.status(200).send({"message":"A new Note has been added"})
    }catch(err){
        res.status(400).send({"message":err.message})
    }
})

noteRouter.patch("/update/:noteID",async(req, res)=>{
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, 'masai')
    const {noteID} = req.params;
    const payload = req.body;
    const req_id = decoded.userID;
    const note = await NoteModel.findOne({_id:noteID})
    const userID_in_note = note.userID
    
    try{
        if(req_id===userID_in_note){
            await NoteModel.findByIdAndUpdate({_id:noteID},payload)
            res.status(200).send({"message":`Data with id ${noteID} has been updated`})
        }else{
            res.status(400).send("Id not matched")
        }
    }catch(err){
        res.status(400).send({"message":err.message})
    }
})

noteRouter.delete("/delete/:noteID",async(req, res)=>{
    const token = req.headers.authorization;
    const decoded = jwt.verify(token,'masai')
    const {noteID} = req.params;
    const req_id = decoded.userID;
    const note = await NoteModel.findOne({_id:noteID})
    const userID_in_note = note.userID
    
    try{
        if(req_id===userID_in_note){
            await NoteModel.findByIdAndDelete({_id:noteID})
            res.status(200).send({"message":`Data with id ${noteID} has been deleted`})
        }else{
            res.status(400).send({"message":"Not authorized"})
        }
    }catch(err){
        res.status(400).send({"message":err.message})
    }
})

module.exports={
    noteRouter
}