import jwt from "jsonwebtoken";
import User from "../src/models/user.model.js";
export const protectRoute= async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"unauthorized- no token provided"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message:"ununauthorized- invalid token provided"})
        }
        const user=await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({message:"user is not found"})
        }
        req.user=user
        next();
    }
    catch(error){
        console.log("error in protect route middleware:",error.message);
        res.status(500).json({message:"internal server error"})
    }
}