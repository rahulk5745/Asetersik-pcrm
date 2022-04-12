let {config} =  require("dotenv");
let ami = null;
ami_connect = async () => {
    console.log("Inside AMI Connection :");
	ami = new require('asterisk-manager')(process.env.PORT,process.env.IP,process.env.ASTNAME, process.env.SECRET, true);
	ami.on('connect', function(e) {
                if (e){
                        console.log("Unable to connect to Asterisk:",e);
                } else {
                        console.log("Successfully Connected to Asterisk.");
                }
        });
	// In case of any connectiviy problems we got you coverd.
	ami.keepConnected();
	return ami;
};

dial = ({
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
	}, callBack) => {
        console.log("Exten:", extension);
        ami.action({
          'action':'originate',
          'channel': "PJSIP/"+agentNumber+"@"+trunk,
          'exten': extension,
          'context': context,
          'priority': priority,
          'Variable': {"CUST_NO":customerNumber, "CALL_ID":callId, "CUST_CLI":customerCli},
          'CallerID': "\""+agentCli+"\" <"+agentCli+">",
          'Account': accountCode,
      	  'Async':'yes'
}, 
	function(err, res) {
        console.log("Call Originated:", "SIP/"+dialObj.num+"@"+dialObj.trunk, ", LeadNo="+dialObj.leadNo, " Err:", err);
        callBack(err, res, callId);
}
	);
}

module.exports = {
	ami_connect:ami_connect,
	dial:dial,
	ami: ami
}
