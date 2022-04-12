const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var callSchema = new mongoose.Schema(
{ _id:String,
  inboundcaller: String,
  inboundDID: String,
  Queuename: String,
  connected_agent:String,
  call_unqid:String,
  current_active_call:String,
  createdAt:String,
}); 

var callstatus = mongoose.model('callstatus',callSchema,'callstatus');
module.exports = callstatus;
