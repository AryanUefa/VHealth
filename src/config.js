const mongoose = require("mongoose");
const connect = mongoose.connect(
  "mongodb+srv://choudharyaryan120203:iotAASS@cluster0.irhbpbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

connect
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch(() => {
    console.log("Database cannot be Connected");
  });

const Loginschema = new mongoose.Schema({
  name: String,
  password: String,
  eid: String,
  email: String,
  // pagePhoto:String
});

const collection = new mongoose.model("users", Loginschema);

module.exports = collection;
