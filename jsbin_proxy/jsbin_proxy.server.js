/*

a proxy and cache for jsbin output.

This bit of code  needs to
- run jsbins server-side
- cache the outs
*/


var Browser = require('zombie');



var urlparser = require("url");

var fs = require("fs");
var pathparser = require("path");
var http = require("http");

var mysecrets = {port: 3005, prod_port: 3005};

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
    if(req.headers["access-control-request-headers"]){
        res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"]);        
    }
  res.setHeader("Access-Control-Allow-Origin", "*");        

  console.log("got request");
  console.log(req.url);

  var split = req.url.split("/");
  var format = split.pop();
  var jsbin_id = split.pop();

  var parsed = urlparser.parse(req.url, true)
  var query = urlparser.parse(req.url, true).query;

  if (format && jsbin_id){
    console.log(parsed);
    runJSBin(jsbin_id, format, req, res);
  }else{
   res.writeHead(200, {'Content-Type': 'text/html', 
                        'Access-Control-Allow-Origin' : '*'});
   res.end("<html><body><pre>not sure what to do</pre></body></html>");
  }

}






function runJSBin(jsbin_id, format, req, res){

/*
   res.writeHead(200, {'Content-Type': 'text/html', 
                        'Access-Control-Allow-Origin' : '*'});
   res.end("<html><body><pre>going ok " + jsbin_id+ ", " + format+ "</pre></body></html>");
return;
*/
    var reqUrl = 'http://localhost/jsbin/'+jsbin_id+'/latest';

    var browser = Browser.create();
    browser.on("done", function(document){
        console.log("done");
        var htmlstring = browser.document.documentElement.outerHTML;
        console.log("got htmlstring");
        console.log(htmlstring);
        htmlstring = htmlstring.replace(/<!--[^>]+Created using [^>]+Source[^>]+edit[^>]-->/i,"");
        htmlstring = htmlstring.replace(/<a id="edit-with-js-bin" href="[^"]+" style="top: -60px;">Edit in JS Bin <img src="http:[^"]+"><\/a>/i,"");
//        htmlstring = htmlstring.replace(/<a id="edit-with-js-bin" href="[^"]+" style="top: -60px;">Edit in JS Bin <img src="http:[^"]+"><\/a>/i,"");
        htmlstring = htmlstring.replace(/<link rel="stylesheet" href="http:\/\/localhost\/jbstatic\/css\/edit.css">/,"");
        htmlstring = htmlstring.replace(/<style id="jsbin-css">[\s]+<\/style>/,"");
        // at this point, we just want the contents of the body

        if(format == "html"){
          //  htmlstring = htmlstring.replace("")
        }else if (format == "json"){


        }

        console.log(htmlstring);
       res.writeHead(200, {'Content-Type': 'text/html', 
                            'Access-Control-Allow-Origin' : '*'});
       res.end(htmlstring);


    });

    browser.visit(reqUrl, function(error){
        if(error){
            console.log("error");
            console.log(error);
        }
    });



    console.log("done");
}



//runJSBin("miv");





/*
Zombie docs here:
https://github.com/assaf/zombie/blob/c638266efd80523c1904ea5d1418aae2e236cce8/README.md#events

*/
/*
    request(reqUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the Google homepage. 
            processJSBin(body);
        }else{
            console.log(error);
        }
    });
*/