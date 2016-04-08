/*

a proxy and cache for jsbin output.

This bit of code  needs to
- run jsbins server-side
- cache the outs

https://github.com/assaf/zombie

*/

    
var urlparser = require("url");

var fs = require("fs");
var pathparser = require("path");
var http = require("http");

var mysecrets = {port: 3005, prod_port: 3005};

var port = mysecrets.port;
if(process && process.env && process.env.NODE_ENV == "production"){
  port = mysecrets.prod_port;
}

var cacheOn = false;
var resultCache = {json : {}, html :{}};

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


  var split_p = url.split(".");
  console.log(split_p);
  var last = split_p[split_p.length - 1];
  if(last == "html" || last == "page" || last == "json"){
    format = split_p.pop();
    console.log( "format is " + format);
  }
  url = split_p.join(".");

  var split = url.split("/");
  console.log(split);
  split.shift();
  split.shift();
  console.log(split);
  var jsbin_id = split.shift();
  console.log(split);
  var pagetype = split.shift();
  var pageid= split.join("/");

  console.log(pagetype);
  console.log(pageid);

  if ((pageid == "" || pageid) && jsbin_id){
    runJSBin(jsbin_id, pagetype, pageid, req, res, format);
  }else{
   res.writeHead(200, {'Content-Type': 'text/html', 
                        'Access-Control-Allow-Origin' : '*'});
   res.end("<html><body><pre>not sure what to do</pre></body></html>");
  }

}






function runJSBin(jsbin_id, pagetype, pageid, req, res, format){

/*
   res.writeHead(200, {'Content-Type': 'text/html', 
                        'Access-Control-Allow-Origin' : '*'});
   res.end("<html><body><pre>going ok " + jsbin_id+ ", " + format+ "</pre></body></html>");
return;
*/
    var reqUrl = 'http://localhost/jsbin/'+jsbin_id+'/latest?pagetype='+pagetype+'&pageid='+pageid+'&headless=true';
    console.log("zombie calling url " + reqUrl);

    if(cacheOn){
      if(resultCache[format][reqUrl]){
        if(format == "json"){
          res.writeHead(200, {'Content-Type': 'application/json', 
                              'Access-Control-Allow-Origin' : '*'});
          res.end(resultCache[format][reqUrl]);
        }
        if(format == "html"){
          res.writeHead(200, {'Content-Type': 'text/html', 
                              'Access-Control-Allow-Origin' : '*'});
          res.end(resultCache[format][reqUrl]);
        }
        return;
      }
    }

    var Browser = require('zombie');
    var browser = Browser.create();
//    browser.on("done", function(document){
    browser.on("done", function(){
      console.log("jsbin browser done");
    });

    browser.on("evaluated", function(code, result, filename){
      console.log("code evaluated");
      /*
      console.log(filename);
      console.log(code);
      console.log(result);
*/
    });
    browser.on("loaded", function(doc){
      console.log("loaded");
 //     console.log(doc);
 //     doc.addEventListener('DOMContentLoaded', function(){console.log("^^^^^^^^^^^^^^^^^^^^^^^^^DOMContentLoaded")}, false);
    });
    browser.on("request", function(request){
//      console.log("...........request");
 //     console.log(request);
    });

    browser.on("xhr", function(event, url){
      console.log("xhr");
      console.log(event);
      console.log(url);
    });



    browser.on("loading", function(doc){
      console.log("!!!!!!!loading");
      doc.addEventListener('DOMContentLoaded', function(){console.log("2^^^^^^^^^^^^^^^^^^^^^^^^^DOMContentLoaded")}, false);

    });

    browser.on("console", function(level, message){
      console.log("++++++++++ console message " + message);
      if(message.match(/SyntaxError/)){
        console.log(new Error().stack);
        var htmlstring = browser.document.documentElement.outerHTML;
//        console.log(htmlstring);
        
      }
      if(message == "c4_done"){
        console.log("Zzzzzzzzzzzzzzzzzzzzzzzombie done");
        var htmlstring = browser.document.documentElement.outerHTML;
        console.log("got htmlstring");
//        console.log(htmlstring);
        htmlstring = htmlstring.replace(/<!--[^>]+Created using [^>]+Source[^>]+edit[^>]-->/i,"");
        htmlstring = htmlstring.replace(/<a id="edit-with-js-bin" href="[^"]+" style="top: -60px;">Edit in JS Bin <img src="http:[^"]+"><\/a>/i,"");
//        htmlstring = htmlstring.replace(/<a id="edit-with-js-bin" href="[^"]+" style="top: -60px;">Edit in JS Bin <img src="http:[^"]+"><\/a>/i,"");
        htmlstring = htmlstring.replace(/<link rel="stylesheet" href="http:\/\/localhost\/jbstatic\/css\/edit.css">/,"");
        htmlstring = htmlstring.replace(/<style id="jsbin-css">[\s]+<\/style>/,"");
        // at this point, we just want the contents of the body

       // console.log(htmlstring);


        if(format == "page"){

          res.writeHead(200, {'Content-Type': 'text/html', 
                              'Access-Control-Allow-Origin' : '*'});
          res.end(htmlstring);
        }else if (format == "json"){
          var json_text= "{}";
          var json_element = browser.document.getElementsByClassName("c4_data").item(0);
          if(json_element){
            json_text = json_element.textContent;
          }
          resultCache.json[reqUrl] = json_text;          

          res.writeHead(200, {'Content-Type': 'application/json', 
                              'Access-Control-Allow-Origin' : '*'});
          res.end(json_text);
        }else if (format == "html"){
          var html_text = "";
          var html_element = browser.document.getElementsByClassName("c4_html").item(0);
          if(html_element){
            html_text = html_element.outerHTML;
          }

          resultCache.html[reqUrl] = html_text;          
          res.writeHead(200, {'Content-Type': 'text/html', 
                              'Access-Control-Allow-Origin' : '*'});
          res.end(html_text);
        }
        browser.tabs.closeAll();
        delete browser;
      }

    });

    browser.on("error", function(error){
      console.log(" browser  on  error");
      console.log(reqUrl);            
      console.log(error);
//      browser.dump();
      var stack = new Error().stack;
      console.log(stack);
      res.writeHead(200, {'Content-Type': 'text/html', 
                          'Access-Control-Allow-Origin' : '*'});
      res.end("<html><body>Browser on visit error <BR>" + error + "  <BR> " + reqUrl + " <BR><pre>"+ stack + "</pre></body></html>");
      browser.tabs.closeAll();
      delete browser;


    });

/*
    browser.open(reqUrl);
*/


    browser.visit(reqUrl, function(error, browser, status){
        console.log("visited");
            console.log(reqUrl);            
            console.log(error);
            console.log(browser);
            console.log(status);
        if(error){
            console.log(" browser visit error");
            console.log(reqUrl);            
            console.log(error);
            console.log(browser);
            console.log(status);
            var stack = new Error().stack;
            console.log(stack);
//            browser.dump();

            res.writeHead(200, {'Content-Type': 'text/html', 
                                'Access-Control-Allow-Origin' : '*'});
            res.end("<html><body>Browser visit error <BR>" + error + " <BR> " + reqUrl + "  <BR> " + status + "<BR><pre>"+ stack + "</pre></body></html>");
            browser.tabs.closeAll();
            delete browser;

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