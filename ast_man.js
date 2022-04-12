var AsteriskClient = {
        ami: null
};

const evtHandlerDefault = (e)=> {
        console.log("Received:", e);
}

AsteriskClient.connect = ({port, host, user, password})=> {
        var AsteriskManager = require('asterisk-manager');
        AsteriskClient.ami = new AsteriskManager(port, host, user, password, true);
        AsteriskClient.ami.on('close', evtHandlerDefault);
        AsteriskClient.ami.on('disconnect', evtHandlerDefault);
        AsteriskClient.ami.on('connect', function(e) {
                if (e){
                        console.log("Unable to connect to Asterisk:",e);
                } else {
                        console.log("Successfully Connected to Asterisk.");
                }
        });
}


AsteriskClient.dial = ({
	accountCode,
	agentNumber,
	agentCli,
	customerNumber,
	customerCli,
	trunk,
	context,
	extension,
	priority,
	callId,
	agentCC,
	customerCC
}, callBack) => {
	console.log("Exten:", extension);
	AsteriskClient.ami.action({
		'action':'originate',
		'channel': "PJSIP/"+agentCC+agentNumber+"@"+trunk,
		'exten': extension,
		'context': context,
		'priority': priority,
		'Variable': {"CUST_NO":customerNumber, "CALL_ID":callId, "CUST_CLI":customerCli, "TRUNK":trunk, "AGENT_NO":agentNumber, "AGENT_CC":agentCC, "CUSTOMER_CC":customerCC},
		'CallerID': "\""+agentCli+"\" <"+agentCli+">",
		'Account': accountCode,
		'Async':'yes'
	}, 
		function(err, res) {
			console.log("Call Originated  Err:", err);
			callBack(err, res, callId);
		}
	);
}

AsteriskClient.queueAdd = ({
        queueName,
	queueDID,
        agentNumber,
        agentName,
	agentId
}, callBack) => {
	console.log('Queue Name received '+queueName);
        AsteriskClient.ami.action({
                'action':'QueueAdd',
                'queue': queueName,
                'interface': 'LOCAL/'+agentNumber+'_'+queueDID+'_'+agentId+'@from-queue',
                'penalty': 0,
                'paused': 0,
                'MemberName': agentName,
                'StateInterface':''
        },
                function(err, res) {
         		console.log("Add Queue  Err:", err);               
                        callBack(err, res, agentNumber);
                }
        );
}

AsteriskClient.queueRemove = ({
        queueName,
	queueDID,
        agentNumber,
        agentName,
	agentId
}, callBack) => {
        console.log('Queue Name received '+queueName);
        AsteriskClient.ami.action({
                'action':'QueueRemove',
                'queue': queueName,
                'interface': 'LOCAL/'+agentNumber+'_'+queueDID+'_'+agentId+'@from-queue',
        },
                function(err, res) {
                        console.log("Remove Queue  Err:", err);
                        callBack(err, res, agentNumber);
                }
        );
} 
//AsteriskClient.connect();
module.exports = AsteriskClient;
