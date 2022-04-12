const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
{  _id:String,
  astext: String,
  astextname:String,
  applicationName:String,
  userId:String,
  series:String
}, { collection : 'crmastext' }); 
const User = mongoose.model("crmastext", UserSchema);
module.exports = User;