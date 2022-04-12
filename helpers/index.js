//Dependencies
let {config} = require("dotenv");

config();
let helpers = {};

helpers.parseJsonToObj = (str) => {
  try{
    return JSON.parse(str);
  }catch(e){
    return {};
  }
};


//Send Response
helpers.response = (code,status,message,data="") => {
  let response = {};
  if(code){
    response.code = code;
  }
  if(status){
    response.status = status;
  }
  if(message){
    response.message = message;
  }
  if(data){
    response.data = data;
  }
  return response;
};

//Send Promise Response
helpers.promiseResponse = (status,data="") =>{
  let response = {};
  if(typeof (status) === "boolean"){
    response.status = status;
  } else {
    response.status = false;
  }
  response.data = data;
  return response;
};

helpers.getDateTime = () => {
	let date_ob = new Date();

	// current date
	// adjust 0 before single digit date
	let date = ("0" + date_ob.getDate()).slice(-2);

	// current month
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

	// current year
	let year = date_ob.getFullYear();

	// current hours
	let hours = date_ob.getHours();

	// current minutes
	let minutes = date_ob.getMinutes();

	// current seconds
	let seconds = date_ob.getSeconds();

	// prints date & time in YYYY-MM-DD HH:MM:SS format
	var finalDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
	console.log("Final Date "+finalDate);
	return finalDate;
}

//export default helpers;
module.exports = helpers;
