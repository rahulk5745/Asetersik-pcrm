let queueModel =  require("../model/queue");
let userModel =  require("../model/user");

// let actions = {};

exports.queueData = async (req) => {
  try{
    var queue = await queueModel.find(req);;
    return queue;
  }catch(e){
    return {};
  }
};

exports.userData = async () => {
  try{
    var user = await userModel.find({astextname:"PenguinCRM 91"});;
    return user;
  }catch(e){
    return {};
  }
};

// module.exports = actions;
