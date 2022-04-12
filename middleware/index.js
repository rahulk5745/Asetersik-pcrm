let middleware = {};

middleware.checkFormatKey = (req, res, next) => {
  let _format = typeof(req.query._format) === "string" && req.query._format === "json" && typeof(req.body) === "object" ? req.query._format : false;
  if(_format){
    next();
  }else{
    res.status(403).json({"message" : "check the api route"});
  }
};


module.exports = middleware;
