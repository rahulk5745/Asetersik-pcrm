//Dependencies
let cors =  require("cors");
let express = require("express");
let {config} =  require("dotenv");
let http = require("http");
const mongoose = require("mongoose");
const axios = require('axios');
let actions = require('./action/actions')
let routes = require("./routes");
let ast_man =  require("./ast_man");
let basicAuth = require('./middleware/basicAuth')
const {parse, stringify} = require('flatted');
//connect DB
// const username = "manish";
// const password = "gvr5eKv2xGhBI9LL";
// const cluster = "cluster0.jtikb.mongodb.net";
// const dbname = "dev_sendclap";

/*
const username = "penguin";
const password = "sA1n0XmpmWXBwEQamA49hmiXBX6W4xaHeA7oXKTxb9UbZOa3";
const cluster = "34.93.185.159";
const dbname = "asterisk";

// mongodb://penguin:sA1n0XmpmWXBwEQamA49hmiXBX6W4xaHeA7oXKTxb9UbZOa3@35.200.251.77:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false

mongoose.connect(
  // `mongodb+srv://${username}:${password}@${cluster}/${dbname}?authSource=admin&replicaSet=atlas-66mnot-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`, 
  ` mongodb://${username}:${password}@${cluster}:27017/${dbname}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
*/
mongoose.connect('mongodb://127.0.0.1:27017/authenticate-api', {
  useUnifiedTopology: true,    
// useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: true
})


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

config();
const app = express();
//Creating Server instance
let server = {};

//Routes
app.use(cors());

app.use(express.json());
app.use(basicAuth)
app.use("/api/v1", routes);

app.use(function (req, res) {
  res.status(404).send("Sorry can not find that!");
});


ast_man.connect({port: process.env.PORT,host: process.env.IP,user: process.env.ASTNAME, password: process.env.SECRET});
var ami = ast_man.ami;
//var ami = new require('asterisk-manager')(process.env.PORT,process.env.IP,process.env.ASTNAME, process.env.SECRET, true);
// In case of any connectiviy problems we got you coverd.
//ami.keepConnected();

// Listen for any/all AMI events.
// ami.on('managerevent', function(evt) {});

// Listen for Action responses.

//ami.on('response', function(evt) {});
setInterval(function(){
var queue = actions.queueData({applicationName:process.env.APPLICATIONNAME,direction:'Outbound'}).then(async(resQueue)=>{
  resQueue.forEach(async(q) => {

    ami.action({
      Action:'Command',
      Command:`queue show ${q.queueName}`, //Get queue detail
    },async function(err, res) {
      let queueString=res.output.toString();
     console.log(queueString);
     let idleUser= queueString.split('Not in use').length-1;  //Check available user
      if(idleUser>0){
      let crmData= await axios.post(`${process.env.CRM_SERVER}${q.applicationName}${process.env.PREDICTIVE_URL}`,{
              queuedata:q,
              userCount:idleUser
            });
       console.log(crmData.data.list);
            if(crmData && crmData.data && crmData.data.list && crmData.data.list.length>0){
            crmData.data.list.forEach(element => {
                        ami.action({
                          //Initate predictive call
                            Action: "Originate",
                            Channel: `local/${element.phone_mobile}@predictive-dialing`,
                            Context: "predictive-dialing-answered",
                            Exten: `${element.phone_mobile}`,
                            Priority: 1,
                            Callerid: `${q.queuedid}`,
                            // Timeout: 30000,
                            Variable: [`queuename=${q.queueName}`,`trunk_name=${element.trunk_name}`,`applicationName=${q.applicationName}`, `queuedid=${q.queuedid}`,`customer_number=${element.phone_mobile}`, `apiurl=${crmData.data.apiurl}`, `id=${element.id}`, `module_name=${crmData.data.module_name}`]
                        },async function(err, res) {
                          // console.log(res);
                      }); 
              });
            }
          }
    });
  });
});
}, 15000);


//Initializing HTTP & HTTPS Server.
let httpServer = http.createServer(app);

server.init = function(){
  //Starting HTTP Server
  if(process.env.HTTP_APP_PORT == "PRODUCTION"){
    try{
      httpServer.listen(process.env.HTTP_APP_PORT, '0.0.0.0', function () {
        console.log(`Http Server Listening On Port : ${process.env.HTTP_APP_PORT}!`);
      });
    }
    catch (e) {
      //Do something for production
    }
  }
  else{
    httpServer.listen(process.env.HTTP_APP_PORT, '0.0.0.0', function () {
      console.log(`Http Server Listening On Port : ${process.env.HTTP_APP_PORT}!`);
    });
  }

};

server.init();
module.exports = mongoose.connection;