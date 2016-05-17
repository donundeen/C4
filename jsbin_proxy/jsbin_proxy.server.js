/*

a proxy and cache for jsbin output.

This bit of code  needs to
- run jsbins server-side
- cache the outs

https://github.com/assaf/zombie

*/

    
var urlparser = require("url");
const Browser = require('zombie');
var fs = require("fs");
var pathparser = require("path");
var http = require("http");

var mysecrets = {port: 3005, prod_port: 3005};

var port = mysecrets.port;
if(process && process.env && process.env.NODE_ENV == "production"){
    port = mysecrets.prod_port;
}


var cacheManager = require('cache-manager');
var mongoStore = require('cache-manager-mongodb');
var mongoCache = cacheManager.caching({
    store : mongoStore,
    uri : "mongodb://localhost:27017/nodeCacheDb",
    options : {
	host : '127.0.0.1',
	port : '27017',
	database : "nodeCacheDb",
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
    console.log(jsbin_id);
    var pagetype = split.shift();
    var pageid= split.join("/");
    
    console.log(pagetype);
    console.log(pageid);
    
    var cacheID = format + "/" + jsbin_id + "/" + pagetype + "/"+ pageid;
    var lastKnownGoodCacheID = format + "/" + jsbin_id + "/" + pagetype + "/"+ pageid;
    var lastKnownGoodTTL = 9999999;

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost:27017/meteor", function(err, db) {
	console.log("connected");
	console.log("error : " +  err);
	
	db.collection("widgets").findOne({_id :jsbin_id  }, function(err, doc){
	    var widgetDoc = {};
	    if(err){
		console.log(err);
	    }else{
		widgetDoc = doc;
	    }
	    if(!widgetDoc.cacheConfig){
		widgetDoc.cacheConfig = {};
	    }
	    if(!widgetDoc.cacheConfig.ttl){
		widgetDoc.cacheConfig.ttl = default_ttl;
	    }
	    if ((pageid == "" || pageid) && jsbin_id){
		mongoCache.get(cacheID, function(err, result){
		    if(err){
			res.writeHead(200, {'Content-Type': 'text/html', 
					    'Access-Control-Allow-Origin' : '*'});
			res.end("<html><body><pre>not sure what to do</pre></body></html>");
			return;
		    }
		    if(result){
			console.log("using cache");
			if(format == "json"){
			    if(res){
				res.writeHead(200, {'Content-Type': 'application/json', 
						    'Access-Control-Allow-Origin' : '*'});
				res.end(result);
				delete res;
			    }
			    return;
			}
			if(format == "html" || format == "page"){
			    if(res){
				res.writeHead(200, {'Content-Type': 'text/html', 
						    'Access-Control-Allow-Origin' : '*'});
				res.end(result);
				delete res;
			    }
			    return;
			    
			}
		    }
		    console.log("not using cache");
		    runJSBin(jsbin_id, pagetype, pageid, req, res, format, widgetDoc, cacheID);
		}); 
	    }else{
		if(res){
		    res.writeHead(200, {'Content-Type': 'text/html', 
					'Access-Control-Allow-Origin' : '*'});
		    res.end("<html><body><pre>not sure what to do</pre></body></html>");
		    delete res;
		}
	    }
	}); 
    });
}





var browserNum = 0;
function runJSBin(jsbin_id, pagetype, pageid, req, res, format, widgetDoc, cacheID){

/*
   res.writeHead(200, {'Content-Type': 'text/html', 
                        'Access-Control-Allow-Origin' : '*'});
   res.end("<html><body><pre>going ok " + jsbin_id+ ", " + format+ "</pre></body></html>");
return;
*/

    var thisNum = browserNum++;
    var reqUrl = 'http://localhost/jsbin/'+jsbin_id+'/latest?pagetype='+pagetype+'&pageid='+pageid+'&headless=true';
    console.log("zombie calling url " + reqUrl);


    var browser = new Browser();

    var consoleMessages = [];

    console.log("defining browser things");
    browser.on("done", function(){
      console.log(thisNum + " " + "jsbin browser done");
    });

    browser.on("closed", function(window){
	console.log(thisNum + " " + "window closed");
    });

    browser.on("done", function(){
	console.log(thisNum + " " + "event loop done");
    });

    browser.on("idle", function(){
	console.log(thisNum + " " + "event loop idle");
    });

    browser.on("inactite", function(){
	console.log(thisNum + " " + "inactive");
    });

    browser.on("evaluated", function(code, result, filename){
      console.log(thisNum + " " + "code evaluated");
      /*
      console.log(filename);
      console.log(code);
      console.log(result);
*/
    });
    browser.on("loaded", function(doc){
      console.log(thisNum + " " + "loaded");
 //     console.log(doc);
 //     doc.addEventListener('DOMContentLoaded', function(){console.log("^^^^^^^^^^^^^^^^^^^^^^^^^DOMContentLoaded")}, false);
    });
    browser.on("request", function(request){
      console.log(thisNum + " " + "...........request");
 //     console.log(request);
    });

    browser.on("xhr", function(event, url){
	console.log("xhr");
	console.log(event);
	console.log(url);
    });
    
    
    
    browser.on("loading", function(doc){
	console.log(thisNum + " " + "!!!!!!!loading");
	doc.addEventListener('DOMContentLoaded', function(){console.log("2^^^^^^^^^^^^^^^^^^^^^^^^^DOMContentLoaded")}, false);
	
    });
    
    browser.on("console", function(level, message){
	consoleMessages.push(message);
	console.log(thisNum + " " + "++++++++++ console message level "+ level + " : "  + message);
	if(message.match(/\[SyntaxError/) || message.match (/\[[a-zA-Z]+Error/)){
            console.log(new Error().stack);
            var htmlstring = browser.document.documentElement.outerHTML;
	    //        console.log(htmlstring);
	    // use "last known good" version, or send back error messages
	    var cmsgs = consoleMessages.join("\n");
	    var stack = new Error().stack;
	    
	    if (format == "json"){
		var json_text= JSON.stringify({error : "error processing widget",
					       messages : consoleMessages,
					       stack : stack});
		if(res){
		    res.writeHead(200, {'Content-Type': 'application/json', 
					'Access-Control-Allow-Origin' : '*'});
		    res.end(json_text);
		    delete res;
		}
	    }else if (format == "html" || format == "page"){
		var html_text = "<div>ERROR Processing widget: <pre>"+cmsgs+"\nstack:\n"+stack+"</pre></div>";
		if(res){
		    res.writeHead(200, {'Content-Type': 'text/html', 
					'Access-Control-Allow-Origin' : '*'});
		    res.end(html_text);
		    delete res;
		}
	    }
            browser.tabs.closeAll();
            delete browser;
	}

	if(message == "c4_done"){
            console.log(thisNum + " " + "Zzzzzzzzzzzzzzzzzzzzzzzombie done");
            var htmlstring = browser.document.documentElement.outerHTML;
            console.log("got htmlstring");
            htmlstring = htmlstring.replace(/<!--[^>]+Created using [^>]+Source[^>]+edit[^>]-->/i,"");
            htmlstring = htmlstring.replace(/<a id="edit-with-js-bin" href="[^"]+" style="top: -60px;">Edit in JS Bin <img src="http:[^"]+"><\/a>/i,"");
	    //        htmlstring = htmlstring.replace(/<a id="edit-with-js-bin" href="[^"]+" style="top: -60px;">Edit in JS Bin <img src="http:[^"]+"><\/a>/i,"");
            htmlstring = htmlstring.replace(/<link rel="stylesheet" href="http:\/\/localhost\/jbstatic\/css\/edit.css">/,"");
            htmlstring = htmlstring.replace(/<style id="jsbin-css">[\s]+<\/style>/,"");
            // at this point, we just want the contents of the body
	    
	    // console.log(htmlstring);
	    
	    
            if(format == "page"){
		mongoCache.set(cacheID, htmlstring, {ttl : widgetDoc.cacheConfig.ttl});
		if(res){
		    res.writeHead(200, {'Content-Type': 'text/html', 
					'Access-Control-Allow-Origin' : '*'});
		    res.end(htmlstring);
		    delete res;
		}

            }else if (format == "json"){
		var json_text= "{}";
		var json_element = browser.document.getElementsByClassName("c4_data").item(0);
		if(json_element){
		    json_text = json_element.textContent;
		}
		
		mongoCache.set(cacheID, json_text, {ttl : widgetDoc.cacheConfig.ttl});
		if(res){
		    res.writeHead(200, {'Content-Type': 'application/json', 
					'Access-Control-Allow-Origin' : '*'});
		    res.end(json_text);
		    delete res;
		}
	    }else if (format == "html"){
		var html_text = "";
		var html_element = browser.document.getElementsByClassName("c4_html").item(0);
		if(html_element){
		    html_text = html_element.outerHTML;
		}		
		mongoCache.set(cacheID, html_text, {ttl : widgetDoc.cacheConfig.ttl});
		if(res){
		    res.writeHead(200, {'Content-Type': 'text/html', 
					'Access-Control-Allow-Origin' : '*'});
		    res.end(html_text);
		    delete res;
		}
            }
            browser.tabs.closeAll();
            delete browser;
	}
    });
    
    browser.on("error", function(error){
	console.log(thisNum + " " + " EEEEEEEEEEEEEEEEEEEEEEEEE browser  on  error");
	var cmsgs = consoleMessages.join("\n");
	var stack = new Error().stack;

	console.log(reqUrl);            
	console.log(error);
	
	//      browser.dump();
	var stack = new Error().stack;
	console.log(stack);
	if(res){
	    res.writeHead(200, {'Content-Type': 'text/html', 
				'Access-Control-Allow-Origin' : '*'});
	    res.end("<html><body>Browser on visit error <BR>" + error + "  <BR> " + reqUrl + " <BR><pre>"+ stack + "</pre><BR>Console messages:<pre>\n"+cmsgs+"\n</pre></body></html>");
	    delete res;
	}
	browser.tabs.closeAll();
	delete browser;
    });
    
    /*
      browser.open(reqUrl);
    */
    
    console.log("calling url now " + reqUrl);
    browser.visit(reqUrl, function(error, browser, status){
        console.log(thisNum + " " + "visited");
        console.log(thisNum + " " + reqUrl);            
        console.log(thisNum + " " + error);
        console.log(thisNum + " " + browser);
        console.log(thisNum + " " + status);
/*
        if(error){
            console.log(" browser visit error");
            console.log(reqUrl);            
            console.log(error);
            console.log(browser);
            console.log(status);
	    
            var stack = new Error().stack;
            console.log(stack);
	    //            browser.dump();
	    if(res){
		res.writeHead(200, {'Content-Type': 'text/html', 
                                    'Access-Control-Allow-Origin' : '*'});
		res.end("<html><body>Browser visit error <BR>" + error + " <BR> " + reqUrl + "  <BR> " + status + "<BR><pre>"+ stack + "</pre></body></html>");
		delete res;
	    }
            browser.tabs.closeAll();
            delete browser;
	    
        }
*/
    });
    
    console.log("done");
}




/*
Zombie docs here:
https://github.com/assaf/zombie/blob/c638266efd80523c1904ea5d1418aae2e236cce8/README.md#events
*/
