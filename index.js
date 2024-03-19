const express= require('express');
const app = express();
const path = require('path');
const {mongoose}=require('mongoose');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
const cors= require("cors")
const ejs= require('ejs');
const kafka = require('kafka-node');
const geolib = require('geolib');
const multer = require('multer');
const verifyToken=require("./middleware/authmiddleware");
const verifyUser=require("./middleware/showAss");
const verifyWebUser=require("./middleware/AuthWeb");
const expressSession=require('express-session');
app.use(expressSession({
    secret:'assignment',
}))
global.userId=null;
global.usertype=null;
app.use('*',(req,res,next)=>{
  userId=req.session.userId;
  usertype=req.session.userType;
  console.log(userId)
  next();
})

app.use(cors({ origin: true }));


app.set('view engine','ejs');

app.listen(3000, (req,res)=>{
    console.log("App is listening at port no 3000")
   
})
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const uploads= multer({storage:storage});
app.get("/",(req,res)=>{res.render("index")})
mongoose.connect('mongodb+srv://admin:admin@cluster0.vaoawh4.mongodb.net/Assignment?retryWrites=true&w=majority');

const signupController=require("./controllers/SignupController");
const loginController = require("./controllers/LoginController");
const webLogin=require("./controllers/web/WebLogin")
const webSignup=require("./controllers/web/WebSignup");
const AssignmentController = require("./controllers/PostAssignment");
const showAssignments=require("./controllers/ShowAssignments");
const loadlogin=require("./controllers/loadLogin");
const loadsignup=require("./controllers/loadSignup");
const loadReqAssignments=require("./controllers/loadReqAssignment")
const webReqAssignments=require("./controllers/web/WebReqAss");
const sendAssSolvereq=require("./controllers/getAssignmentReqbySolver");
const deleteAssignment=require("./controllers/studDeleteAssignment");
const EmailChecker=require("./controllers/checkEmail");
const passwordChecker=require("./controllers/checkPassword");
const optChecker=require("./controllers/userLogin");
const showStudentAssignment = require('./controllers/showStudentAssignment');
const showAssignmentsByAcc=require('./controllers/showAssignmentByaccepted');

app.get("/login",loadlogin)

app.get("/signup",loadsignup)
app.post("/signup",signupController);
app.post("/login",loginController);
app.post("/email/login",EmailChecker);
app.post("/password/login",passwordChecker);
app.post("/otp/login",optChecker);
//app.post("/weblogin",webLogin); //this site route not use this for api testing.
//app.post("/websignup",webSignup); //this site route not use this for api testing.
app.get("/reqass",verifyWebUser,loadReqAssignments);
app.post("/webreqass",uploads.single('files'),verifyWebUser,webReqAssignments)

app.post("/post/assignments",verifyToken,uploads.single('files'),AssignmentController);
app.get("/showAssignments",verifyUser,showAssignments);
app.get("/showAssignmentsByAcc",verifyUser,showAssignmentsByAcc);
app.get("/showstudAssignments",showStudentAssignment);
app.put("/sendAssSolvereq/:aid",verifyUser,sendAssSolvereq);
app.delete("/delete/assignment/:did",deleteAssignment);


