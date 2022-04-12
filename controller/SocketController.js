let helpers = require("../helpers");
let { config } = require("dotenv");
//client.js
const io = require('socket.io-client');
config();

let sock = {};
var initTime;

sock.send = (req, res, next)=>{
	console.log(`${JSON.stringify(req.params)}`);
	
	var custNo = req.params.custNo;
	var agentId = req.params.agentId;
	var did = req.params.did;
	var uid = req.params.uniqueId;


//var sockClient = Client.connect('http://34.93.185.159:3001', {reconnect: false});
//const socket = io('http://34.93.185.159:3001');

const socket = io('https://socket.penguinoncloud.com');
//const socket = io('http://6b8b-115-96-192-27.ngrok.io');
socket.emit("connected", "ast");
	// Add a connect listener
//io.on('connection', function (socket) {
//    	console.log('Connected!');
	let eventJson = {
		"extension":agentId,
		"data":[custNo,did,"Inbound",uid]
	};
	console.log('Socket Data '+JSON.stringify(eventJson));
	socket.emit("sendEvent", eventJson, (resp)=>{
		console.log("response: " + JSON.stringify(resp));
	});
	res.send('ok');
	//socket.close();
//});
}

module.exports = sock;
