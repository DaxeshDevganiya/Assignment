const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

module.exports=async(req,res)=>{
    try{
       const{email,contact}=req.body;
        const user=await User.findOne( { $or: [ { email }, { contact} ] } )
        if(user){
            const matchPassword=await bcrypt.compare(req.body.password,user.password);
            if(matchPassword){
                const min = 100000; // Minimum value (inclusive)
    const max = 999999; // Maximum value (inclusive)
    const otp= Math.floor(Math.random() * (max - min + 1)) + min;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        // port: 587,
        // secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "tasksystem2024@gmail.com",
          pass: "cguoodbjkmlarbkn",
        },
      })
      const info = await transporter.sendMail({
        from: 'tasksystem2024@gmail.com', // sender address
        to: user['email'], // list of receivers
        subject: "Otp for login", // Subject line
        text: "You have new Assignment in your portal", // plain text body
        html: "<b>Your Otp for login is </b>:"+otp, // html body
      });
      
                res.status(200).json({ "message":"Otp sent Successfully","status":200,"otp":otp,"user":user });
              
                   
            }else{
                res.status(401).json({"message":"password wrong","status":401});
            }
        }else{
            res.status(400).json({"message":"User not exist","status":400});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}