
const auth = require('basic-auth')
const mongoose = require('mongoose')
//const {parse, stringify} = require('flatted');
const b = require('../index')




const BasicAuth = async (req, res, next) => {
    
           //console.log(JSON.stringify(db.collection('auth')))
        //   console.log("#################"+Qresult.appname)
           try{

            var Qresult={
                appname:'',
                token :''
            };
            console.log('middleware: basic auth')
        
            const user = await auth(req)
            
            //console.log("........................."+JSON.stringify(user))
            // const username = 'test'
            // const password = '123456'
            mongoose.connect('mongodb://127.0.0.1:27017/authenticate-api', {
                useUnifiedTopology: true,    
              })
              var db = mongoose.connection
              var applicationName = req.body.applicationName;
              //console.log("---------"+applicationName)
              var token = req.headers.token
                
                        
                var result = await db.collection("auth").findOne({appname:applicationName,token:token});
                Qresult.appname=result.appname
                Qresult.token=result.token


                if (  Qresult.appname  === applicationName &&  Qresult.token === token) {
                    console.log('Basic Auth: success')
                    next()
                    //return user
                } 
           } catch (e) {
                console.log('Basic Auth: failure')
                console.log('Not found..')
                res.statusCode = 401
                await res.end('Unauthorized') 
           }
           //console.log("request token --:  "+token)
    
    
  
}

module.exports = BasicAuth