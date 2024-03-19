const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');


module.exports=async(req,res)=>{
    try{
       const{email,contact}=req.body;
        const user=await User.findOne( { $or: [ { email }, { contact} ] } );
        console.log(user);
        if(user){
                res.status(200).json({ "message":"Email found","status":200,"Data":user});
                   
            }else{
                res.status(401).json({"message":"Email not Found","status":401});
            
        }
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}
