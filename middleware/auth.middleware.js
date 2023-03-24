const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
    const token=req.headers.authorization
    if(token){
        const decoded = jwt.verify(token,'masai')
        if(decoded){
            req.body.userID=decoded.userID
            next();
        }else{
            res.status(400).send({"message":"Please Login first"})
        }
    }else{
        res.status(400).send({"message":"Failed"})
    }
}
module.exports={
    auth
}