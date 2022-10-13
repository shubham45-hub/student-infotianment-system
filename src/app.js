const express = require('express');
const path = require('path');
const hbs = require("hbs");
const app = express();

require("./db/conn");
const Register = require("./models/register");


const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/",(req, res)=>{
    res.render("register");
})

app.get("/register", (req, res)=>{
    res.render("register");
})

app.get("/login", (req, res)=>{
    res.render("login");
})

app.get("/home", (req, res)=>{
    res.render("home");
})

app.get("/university", (req, res)=>{
    res.render("university");
})

//create a new user in our database
app.post("/register", async (req, res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){
           
           const registerStudent = new Register({
              firstname : req.body.firstname,
              lastname : req.body.lastname,
              email: req.body.email,
              password: req.body.password,
              confirmpassword: req.body.confirmpassword,
              gender: req.body.gender
           })
           
             const registered = await registerStudent.save();
             res.status(201).render("login");

        }else{
            res.send("password not matched");
        }

    }catch(err){
        res.status(400).send(err);
    }
})


//login check

app.post("/login", async(req, res)=>{
    try{
       const email = req.body.email;
       const password = req.body.password;

     const useremail = await Register.findOne({email:email});
     
     if(useremail.password === password){
        res.status(201).render("university");
     }else{
        res.send("Invalid login details");
     }

    }catch(err){
        res.status(404).send("invalid login details");
    }
})

app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
})