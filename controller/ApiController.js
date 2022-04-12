let helpers = require("../helpers");
let { config } = require("dotenv");
let actions = require("../action/actions");

config();

let api = {};

api.getData = async (req, res) => {
  // console.log(process.env.ASTNAME);
  try {
    var chat = await actions.queueData();
    res
      .status(200)
      .json(helpers.response("200", "success", "Fetch Successful", chat));
  } catch (e) {
    res
      .status(400)
      .json(helpers.response("400", "error", "Something went wrong."));
  }
};

module.exports = api;
