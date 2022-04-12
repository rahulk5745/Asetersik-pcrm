const mongoose = require("mongoose");
const QueueSchema = new mongoose.Schema(
{  _id:String,
   applicationName: String,
   queueId: String,
   queueName: String,
   queuedid: String,
   direction: String,
   member: Array
}, { collection : 'queue' }); 
const Queue = mongoose.model("queue", QueueSchema);
module.exports = Queue;
