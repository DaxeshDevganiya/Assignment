const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');


module.exports=async(req,res)=>{
    try{
                const token = jwt.sign({ userId: user._id }, 'assignment', {
                    expiresIn: '1h',
                    });

                 if(token){
                    const token = req.header('Authorization');
                    const decoded = jwt.verify(token, 'assignment');
                    const sid = decoded.userId;
                    const user=await User.findOne({_id:sid});
                    res.status(200).json({ "message":"Login successfully","status":200,"Data":user ,"token":token});
                 }  else{
                    res.status(401).json({"message":"password wrong","status":401});
                 } 
               
              
                   
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}