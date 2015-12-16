/*

A proxy that returns a random gif for a specified search string.

so including a random gif is as easy as
<img src="/giphy_proxy/{{term}}">

-- eg: http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=waiting


*/

    
var urlparser = require("url");

var fs = require("fs");
var pathparser = require("path");
var http = require("http");

var mysecrets = {port: 3009, prod_port: 3009};

var port = mysecrets.port;
if(process && process.env && process.env.NODE_ENV == "production"){
  port = mysecrets.prod_port;
}

var error_img = fs.readFileSync('./error.gif');

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

  var format = "page";

    var rand = Math.random() * 100;
    if(req.headers["access-control-request-headers"]){
        res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"]);        
    }
  res.setHeader("Access-Control-Allow-Origin", "*");        

  console.log("got request");
  console.log(req.url);

  var url = req.url;



  var split = url.split("/");
  var term = split.pop();
  console.log(term);

  if (term && term != "favicon.ico"){
    getRandGiphy(term, res);
  }else{
     res.writeHead(200, {'Content-Type': 'image/gif' });
     res.end(error_img, 'binary');
  }
}


function getRandGiphy(term, res){
  var url = "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag="+ encodeURIComponent(term);
  console.log("url is "+ url);
  var request = require("request");

  request(url, function(error, response, body){
    if (!error && response.statusCode == 200) {   
      // console.log("|"+retdata+"|");
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! success");
      var retdata = JSON.parse(body);
      console.log(JSON.stringify(retdata, null, ' '));
      var imageurl = retdata.data.fixed_width_downsampled_url;
      console.log("mageurl is  " + imageurl);
//      res.writeHead(200, {'Content-Type': 'image/gif' });
      var request2 = require("request");
      request2.get(imageurl).pipe(res);     
//     res.end(error_img, 'binary');


/*
      if(retdata == ''){
        console.log("no results");
        retdata = {};
      }else{
        resultCache[url] = retdata;
        res.writeHead(200, {'Content-Type': 'image/gif'});
        res.end(JSON.stringify(retdata));
      }
      */
    }else{

     res.writeHead(200, {'Content-Type': 'image/gif' });
     res.end(error_img, 'binary');

    }
  });
}

