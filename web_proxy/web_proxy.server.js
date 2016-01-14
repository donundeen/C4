var urlparser = require("url");

var fs = require("fs");
var pathparser = require("path");
var http = require("http");

var request = require("request");

var mysecrets = {port: 3006};

var resultCache = {};

var port = mysecrets.port;
if(process && process.env && process.env.NODE_ENV == "production"){
  port = mysecrets.prod_port;
}

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

  var headers = {};
  if(parsed.query.headers){
      headers = JSON.parse(parsed.query.headers);
  }
  
  var path = parsed.path;

  url = parsed.query.url;

  var options = {url: url, headers: headers};

  if(resultCache[url]){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(resultCache[url]));
    return;
  }

  request(options, function(error, response, body){
    if (!error && response.statusCode == 200) {   
      // console.log("|"+retdata+"|");
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! success");
      var retdata = JSON.parse(body);

      if(retdata == ''){
        console.log("no results");
        retdata = {};
      }else{
        resultCache[url] = retdata;
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(retdata));
      }
    }else{
      console.log("Eeeeeeeeeeeeeeeeeeeeeeeee     returning error");
      console.log(error);
//      console.log(response);
      console.log(body);
      res.writeHead(200, {'Content-Type': 'text/html', 
                        'Access-Control-Allow-Origin' : '*'});
      res.end("<html><body><pre>not sure what to do \n" + error + "\n </pre></body></html>");
    }
  });
}

