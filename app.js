require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const { urlencoded } = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");


const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = "Thisislittlesecret.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);


app.get("/", function (req, res) {
    res.render("home");
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/register", function (req, res) {
    res.render("register");
})

app.post("/register", function (req, res) {
    try {
        console.log(req.body.password);
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        })
        newUser.save();
        res.render("secrets");
    } catch (err) {
        res.send(err);
    }
})


app.post("/login", function(req, res){
    try {
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({email: username}) .then(function(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        })
    } catch (err){
        res.send(err);
    }

})



app.listen(3000, function () {
    console.log("Starts on port 3000");
})