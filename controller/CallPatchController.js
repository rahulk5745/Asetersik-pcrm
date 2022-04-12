let helpers = require("../helpers");
let { config } = require("dotenv");
let ast_man = require('../ast_man');
var cdrReport = require('../model/cdrreport');
var queue = require('../model/queue');
const axios = require('axios');
config();

let cpApi = {};
var initTime;

cpApi.callPatch = async (req, res) => {
  try {
    console.log("Call Patch Post Request :"+JSON.stringify(req.body));
    /*if (!req.body.leadNo || !req.body.agentNo || !req.body.recordId || !req.body.moduleName || !req.body.callUniqueId || !req.body.callDirection || !req.body.trunkName || !req.body.did || !req.body.agentId || !req.body.extension)
    {
     res
      .status(400)
      .json(helpers.response("400", "error", "Some Parameters Missing"));
    }*/
	  /**
	   * {ami,
        accountCode,
        agentNumber,
        agentCli,
        customerNumber,
        customerCli,
        trunk,
        context,
        extension,
        priority,
        callId
        }*/
    
	var customerNum = req.body.mobile;
    	var recordId = req.body.record_id;
    	var moduleName = req.body.module_name;
    	var agentNum = req.body.agent_phone_mobile;
    	var callUniqueId = req.body.CallUniqueID;
    	var callDirection = req.body.direction;
    	var trunkName = req.body.trunk_name;
   	var did = req.body.did;
    	var agentId = req.body.agent_id;
   	var extension = req.body.extension;
   	var agentCC = req.body.agent_country_code;
   	var customerCC = req.body.customer_country_code;
   	var applicationName = req.body.applicationName;
   	var applicationUrl = req.body.applicationUrl;
	console.log(`Dialing`);
	initTime = new Date();
	var accountCode = `${moduleName}_${callUniqueId}_${customerNum}_${agentNum}`;
	
	var callDetails = new cdrReport({
		_id:callUniqueId,
        	call_init:helpers.getDateTime(),
        	call_start:"",
  		callerid:did,
  		call_source:customerNum,
  		call_destination:agentNum,
  		call_duration:0,
  		call_talktime:0,
  		call_dispostion:"Failed",
  		call_accountcode:accountCode,
  		call_uniqueid:callUniqueId,
  		call_application:applicationName,
  		call_userfield:"",
  		call_recordingpath:"",
  		call_recordingfile:"",
  		createdAt:helpers.getDateTime(),
		application_url:applicationUrl
      	});
	callDetails.save((err, data) => {
            if (!err)
                console.log('Call Record added succcessfully : ');
            else
                console.log('Error during record insertion : ' + err);
      });
	ast_man.dial({
		accountCode: `${moduleName}_${callUniqueId}_${customerNum}_${agentNum}`,
		agentNumber: agentNum,
		agentCli: did,
		customerNumber: customerNum,
		customerCli: did,
		trunk: trunkName,
		context: "callpatch",
		extension: customerNum,
		priority: 1,
		callId: callUniqueId,
		agentCC: agentCC,
		customerCC: customerCC
	},
	(err, res)=>{

	console.log(`Response: ${JSON.stringify(res)}, error: ${err}`);
	}
	);	

	console.log(`dial initiated`);
    res
      .status(200)
      .json(helpers.response("200", "success", "Fetch Successful",""));
  } catch (e) {
	  console.error(`Exception in Dial: ${e}`);
    res
      .status(400)
      .json(helpers.response("400", "error", "Something went wrong."));
  }
};

cpApi.agentLogin = async (req, res) => {
	try {
		console.log("Agent Login Post Request :"+JSON.stringify(req.body));
		var queueName;
		var messageTxt;
		var statusCode;
		var statusText;
		var queueDID;
		var applicationName = req.body.applicationName;
		var extension = req.body.extension;
		var agentName = req.body.agent_name;
		//LOCAL/+917087561823_+12055286336@from-queue
		//var agentNum = req.body.agent_country_code+req.body.agent_phone_mobile+'@'+req.body.trunk_name;
		var agentNum = req.body.agent_country_code+req.body.agent_phone_mobile;
		queue.findOne({applicationName:applicationName, "member":extension}, function (err, docs) {
		//queue.find({"member":extension}, function (err, docs1) {
			if (err)
			{
				console.log("Error " +err);
				res.status(400).json(helpers.response("400", "error", "Something went wrong."));
			}
			else
			{
				console.log("Result : ", docs);
				if(docs != null)
				{
					queueName = docs.queueName;
					queueDID = docs.queuedid;

					ast_man.queueAdd({
						queueName: queueName,
						queueDID: queueDID,
						agentNumber: agentNum,
						agentName: agentName,
						agentId: extension
					},
						(err, req, astResp)=>{
							console.log(`Response: ${JSON.stringify(astResp)}, error: ${JSON.stringify(err)}`);
							if(err != null)
							{
								messageTxt = err.message;
								statusCode=400;
								statusText='error';
								console.log("Inside Error "+messageTxt);
                        					res.status(400).json(helpers.response(statusCode, statusText, String(messageTxt)));
							}
							else
							{
								messageTxt = astResp.message;
								statusCode=200;
								statusText = 'success';
                        					res.status(200).json(helpers.response(statusCode, statusText, "Queue added succefully"));
							}
                        			//res.status(statusCode).json(helpers.response(statusCode, statusText, String(messageTxt)));
						}
					);
				}
				else
				{
                        		res.status(400).json(helpers.response("400", "error", "Queue member not found for "+extension));
				}
			}
		});	
	} catch (e) {
		console.error(`Exception in Add Queue: ${e}`);
		res
			.status(400)
			.json(helpers.response("400", "error", "Something went wrong."));
	}
};

cpApi.agentLogout = async (req, res) => {
	try {
		console.log("Agent Logout Post Request :"+JSON.stringify(req.body));
		var queueName; 
		var queueDID;
		var applicationName = req.body.applicationName;
		var extension = req.body.extension;
		var agentName = req.body.agent_name;
		var agentNum = req.body.agent_country_code+req.body.agent_phone_mobile;
		queue.findOne({applicationName:applicationName, "member":extension}, function (err, docs) {
			if (err){
				console.log(err)
			}
			else{
				console.log("Result : ", docs);
				queueName = docs.queueName;
				queueDID = docs.queuedid;
			}

			ast_man.queueRemove({
				queueName: queueName,
				queueDID: queueDID,
				agentNumber: agentNum,
				agentName: agentName,
				agentId: extension
			},
				(err, res)=>{

					console.log(`Response: ${JSON.stringify(res)}, error: ${err}`);
				}
			);
			res
				.status(200)
				.json(helpers.response("200", "success", "Logout Successful",""));
		});	
	} catch (e) {
		console.error(`Exception in Add Queue: ${e}`);
		res
			.status(400)
			.json(helpers.response("400", "error", "Something went wrong."));
	}
};

cpApi.CdrUpdateReport = async (req, res) => {
  try {
    console.log("Call Patch CDR Update Request :"+req.query.CallUniqueID);
    
    	var callUniqueId = req.query.CallUniqueID;
    	var evt = req.query.evt;
    	var dialStatus = req.query.dial_status;
    	var duration = req.query.duration;
    	var recName = req.query.rec_name;
	console.log('Event '+evt);	
	console.log('Id '+callUniqueId);	
	console.log('Dial Status '+dialStatus);	
	console.log('Duration '+duration);	
	if(evt == 'answered')
	{
		console.log('Inside answered');
		const filter = { _id: callUniqueId };
		const update = { call_dispostion: 'No Answer', call_start:helpers.getDateTime()};
		cdrReport.findOneAndUpdate(filter, update, {new: true},function(err, doc) {
		if(err) {console.log(err);}
        	else {console.log('success');}
		});
	}
	else if(evt == 'hangup')
	{
		console.log('Inside hangup');
		var endTime = new Date();
		var talkTime = endTime.getTime() - initTime.getTime(); 
		var callDuration = endTime.getTime() - initTime.getTime();
                const filter = { _id: callUniqueId };
                const update = { call_dispostion:dialStatus, call_end:helpers.getDateTime(), call_duration:duration, call_talktime:duration };
                cdrReport.findOneAndUpdate(filter, update, {new: true},function(err, doc) {
                if(err) {console.log(err);}
                else
			{
				console.log(JSON.stringify(doc));
				//Hitting CRM api
				const url = doc.application_url+'/Callback_dialler/dialer_data?CallDuration='+doc.call_duration+'&CallStartDatetime='+doc.call_start+'&CallEndDatetime='+doc.call_end+'&CallUniqueID='+doc.call_uniqueid+'&direction=Outbound&recording_path='+recName+'&mobile='+doc.call_destination;
				axios.get(url).then((response) => {
					console.log(response.data);
					console.log(response.status);
					console.log(response.statusText);
				});
			}
		});
	}
    res
      .status(200)
      .json(helpers.response("200", "success", "CDR Report Inserted Successfully",""));
  } catch (e) {
	  console.error(`Exception in Dial: ${e}`);
    res
      .status(400)
      .json(helpers.response("400", "error", "Something went wrong."));
  }
};

module.exports = cpApi;
