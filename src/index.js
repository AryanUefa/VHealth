const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const collection = require("./config");
const bcrypt = require("bcrypt");
const notifier = require("node-notifier");
const app = express();
const { error } = require("console");
const { name } = require("ejs");
// let multer = require('multer');
// let storage = multer.diskStorage({
//     destination:'public/images/',
//     filename: (req,file,cb)=>{
//         cb(null,file.originalname)
//     }
// })
// let upload = multer({
//     storage: storage
// })
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});
app.post("/scan", async (req,res)=>{
  try {
    const check = await collection.findOne({ eid: req.body.doctorname });
      if(!check){
        res.render("wronguser");
      }
      else{
        res.render("scan", { doctorName: check.name, doctorID: check.eid });
      }
    // }
  } catch {
    res.render("error");
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/home", (req, res) => {
  res.render("home");
});
app.get("/runcmd", async (req, res) => {
  exec("python datafetch.py fetch", (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing command:", error.message);
      return res.status(500).send("Error executing command");
    }
    if (stderr) {
      console.error("Command stderr:", stderr);
    }

    let stdoutJSON;
    try {
      stdoutJSON = JSON.parse(stdout);
    } catch (parseError) {
      console.error("Error parsing stdout as JSON:", parseError);
      return res.status(500).send("Error parsing command output");
    }
    stdoutJSON.address = "home";
    const response = JSON.stringify(stdoutJSON);
    console.log("res:", response);
    res.send(response);
  });
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
    eid: req.body.eid,
    email: req.body.email,
    // pagePhoto: req.file.filename
  };

  const existingUser = await collection.findOne({ eid: data.eid });

  if (existingUser) {
    res.send("User already exists. Please choose a different username.");
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;
    const userdata = await collection.insertMany(data);
    console.log(userdata);
    notifier.notify({
      title: "Successfully Created User",
      message: "You will be redirected to login page now",
      sound: true,
      timeout: 10,
    });
    res.render("login");
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ eid: req.body.username });
    if (!check) {
      res.render("wronguser");
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (!isPasswordMatch) {
      res.render("wrongpassword");
    } else {
      res.render("scan", { doctorName: check.name, doctorID: check.eid });
    }
  } catch {
    res.render("error");
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
