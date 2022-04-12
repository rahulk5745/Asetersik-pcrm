const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cdrSchema = new mongoose.Schema(
{ _id:String,
  call_init: String,
  call_start: String,
  call_end: String,
  callerid:String,
  call_source:String,
  call_destination:String,
  call_duration:Number,
  call_talktime:Number,
  call_dispostion:String,
  call_accountcode:String,
  call_uniqueid:String,
  call_application:String,
  call_userfield:String,
  call_recordingpath:String,
  call_recordingfile:String,
  createdAt:String,
  application_url:String
}); 

var cdrreport = mongoose.model('cdrreport',cdrSchema,'cdrreport');
module.exports = cdrreport;
