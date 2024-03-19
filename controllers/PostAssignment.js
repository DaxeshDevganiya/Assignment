const Assignment=require("../Models/AssignmentModel");
const AssignAssignments=require("../Models/AssignAssignments");
const User=require("../Models/UserModel");
const multer = require('multer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const nodemailer = require("nodemailer");

module.exports=async(req,res)=>{
    
    try{
        
        console.log(req.body);
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'assignment');
        const sid = decoded.userId;
        
        
        const { assignmentName,deadlineDate,price,industry} = req.body;
        const user=await User.find({industry:industry});
        
        if(req.body.price<=10){
            return res.status(403).json({"message":"Price Must be Greater than 10","status":"403"});
        }
        const companyPrice=price*25/100;
        const solverPrice= price-companyPrice;
    
        const postAssignment= new Assignment({sid,assignmentName,deadlineDate,price:solverPrice,companyPrice:companyPrice,files:req.file.filename,location,industry,minPrice:10,active:0})
        if(postAssignment){
//            

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     // port: 587,
//     // secure: false, // Use `true` for port 465, `false` for all other ports
//     auth: {
//       user: "tasksystem2024@gmail.com",
//       pass: "cguoodbjkmlarbkn",
//     },
//   })
//   var mailto=[];
//   for(var i=0;i<user.length;i++){
//     const info = await transporter.sendMail({
//         from: 'tasksystem2024@gmail.com', // sender address
//         to: user[i]['email'], // list of receivers
//         subject: "Assignment Update", // Subject line
//         text: "You have new Assignment in your portal", // plain text body
//         html: "<b>You have new Assignment in your portal</b>", // html body
//       });
//   }
//   mailto.toString();
  
            postAssignment.save();
            const assign=new AssignAssignments({sid:sid,solveid:"-",assignmentName,deadlineDate,price:solverPrice,companyPrice:companyPrice,minPrice:10,files:req.file.filename,industry,active:0})
            assign.save();
        }
        
        res.status(200).json({"message":"Assignment added successfully","status":200});
       
    }catch(error){
        console.log(error);
        res.status(400).json({"message":error,"status":400});
    }
}