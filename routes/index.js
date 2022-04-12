// Dependencies
let express = require("express");
let apiController = require("../controller/ApiController");
let callPatchController = require("../controller/CallPatchController");
let sockController = require("../controller/SocketController");
let basicAuth = require("../middleware/basicAuth");

const router = express.Router();

// Routes
router.route("/").get((req, res) => res.status(200).send("Hola!!! You are one step away from Penguin API"));
//router.use(middleware.checkFormatKey);


//API
// router.route("/test").get(middleware.checkFormatKey,apiController.getData);

router.route("/test").get(apiController.getData);

//Get API for Socket Send
router.route("/sock/:custNo/:agentId/:did/:uniqueId").get(sockController.send);

//Post API for Call Patch
router.route("/callpatch").post(callPatchController.callPatch);

//Get API for Call Records
router.route("/callpatch/update/cdr").get(callPatchController.CdrUpdateReport);

//Post API for Agent Login
router.route("/callpatch/agent/login",basicAuth).post(callPatchController.agentLogin);

//Post API for Agent Logout
router.route("/callpatch/agent/logout").post(callPatchController.agentLogout);

router.post('/users/basicauth', async(req, res) => {
    // console.log('inside api');
    // console.log(req)
    try{
        const user = await authenticate(req.body);
        res.send(user)
    } catch (e) {
        res.status(500).send('something went wrong');
    }
})
module.exports = router;
