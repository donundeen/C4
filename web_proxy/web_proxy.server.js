var limit = require("simple-rate-limiter");

var urlparser = require("url");

var fs = require("fs");
var pathparser = require("path");
var http = require("http");

var request = require("request");

var mysecrets = {port: 3006};

var resultCache = {};
var useCache = true;

var domain_limiter_functions = {};

var port = mysecrets.port;
if(process && process.env && process.env.NODE_ENV == "production"){
    port = mysecrets.prod_port;
}
var mongoport = 27017;
if(process.env.MONGOPORT){
    console.log("overriding MONGOPORT to " + process.env.MONGOPORT);
    mongoport = process.env.MONGOPORT;
}

var cacheManager = require('cache-manager');
var mongoStore = require('cache-manager-mongodb');
var mongoCache = cacheManager.caching({
    store : mongoStore,
    uri : "mongodb://localhost:"+mongoport+"/nodeCacheDbWSP",
    options : {
        host : '127.0.0.1',
        port : mongoport,
        database : "nodeCacheDbWSP",
        collection : "cacheManager",
        compression : false,
        server : {
            poolSize : 5,
            auto_reconnect: true
        }
    }
});
var ttl = 60;
var default_ttl = 60;






startServer();

var started = false;
function startServer(){
    
    if(!started){
	started = true;
    }else{
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! already started!");
	return;
    }
    
    var http = require('http');
    http.createServer(function (req, res) {
	   parseRequest(req, res);
	
    }).listen(port);
    console.log('Server running at port ' + port);
}



function parseRequest(req, res){
    var rand = Math.random() * 100;
    /*
      if(req.headers["access-control-request-headers"]){
      res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"]);        
      }
      res.setHeader("Access-Control-Allow-Origin", "*");        
    */
    
    var parsed = urlparser.parse(req.url, true)
    var query = urlparser.parse(req.url, true).query;
    var url = req.url.replace("/web_proxy/?url=","");
    
    console.log(" in parseRequest");
    console.log(parsed.query);

    var headers = {};
    if(parsed.query.headers){
	   headers = JSON.parse(parsed.query.headers);
       url = url.replace(/\&headers=[^&]*/,"");
    }
    
    var path = parsed.path;
    

    console.log("url is "+ url);
    
    if(url == ""){
    	res.writeHead(200, {'Content-Type': 'application/json'});
	   res.end(JSON.stringify({}));
	   return;
    }
    
    var cacheID = url;
    var matches = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im);
    var domain = matches[1];
    var split = domain.split("?");
    domain = split[0];
    console.log("domain is " + domain);
    
    if(!domain_limiter_functions[domain]){
	domain_limiter_functions[domain] = limit(function(_url, _headers, _res, _cacheID ){
	    
	    var options = {url: _url, headers: _headers};
	    
	    request(options, function(error, response, body){
		if (!error && response.statusCode == 200) {   
		    // console.log("|"+retdata+"|");
		    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! success");
		    var retdata = JSON.parse(body);
		    
		    if(retdata == ''){
			console.log("no results");
			retdata = {};
		    }
		    _res.writeHead(200, {'Content-Type': 'application/json'});
		    _res.end(JSON.stringify(retdata));
		    console.log("saving to cache at id " + _cacheID);
		    mongoCache.set(_cacheID, retdata, {ttl : 60});
		    
		    return;      
		}else{
		    console.log("Eeeeeeeeeeeeeeeeeeeeeeeee     returning error");
		    var retdata = {error : true, message : error, response : response};
		    console.log(error);
		    //      console.log(response);
		    console.log(body);
		    _res.writeHead(200, {'Content-Type': 'application/json', 
					 'Access-Control-Allow-Origin' : '*'});
		    _res.end(JSON.stringify(retdata));
		    return;
		}
	    });
	    return;
	    
	}).to(5).per(1000);
    }else{
    }
    

    
    
    if(useCache){	
	mongoCache.get(cacheID, function(err, result){
            if(err){
		res.writeHead(200, {'Content-Type': 'text/html',
                                    'Access-Control-Allow-Origin' : '*'});
		res.end("<html><body><pre>Cache Error\n "+ err +"</pre></body></html>");
		return;
            }
            if(result){
		console.log("got cache data for " + cacheID);
		res.writeHead(200, {'Content-Type': 'application/json',
                                     'Access-Control-Allow-Origin' : '*'});
		res.end(JSON.stringify(result));
		return;
            }
            console.log("not using cache for  " + cacheID);
	    domain_limiter_functions[domain](url, headers, res, cacheID); 
	});
	
	return;
    }else{
	domain_limiter_functions[domain](url, headers, res, cacheID); 
    }
    
    
  
}

