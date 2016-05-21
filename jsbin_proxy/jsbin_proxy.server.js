/*

a proxy and cache for jsbin output.

This bit of code  needs to
- run jsbins server-side
- cache the outs

https://github.com/assaf/zombie

*/

    
var urlparser = require("url");
var phantom = require("phantom");


var fs = require("fs");
var pathparser = require("path");
var http = require("http");

var mysecrets = {port: 3005, prod_port: 3005};

var port = mysecrets.port;
if(process && process.env && process.env.NODE_ENV == "production"){
    port = mysecrets.prod_port;
}



var useCache = true;
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
    var split_p1 = split_p;
    console.log(split_p);
    var last = split_p[split_p.length - 1];
    if(last == "html" || last == "page" || last == "json"){
	format = split_p.pop();
	console.log( "format is " + format);
    }else{
	console.log("not sure of format, guessing page" );
	console.log(split_p1);
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
		    if(result && useCache){
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

    var consoleMessages = [];

    var sitepage = null;
    var phInstance = null;
    var c4_error = false;
    var c4_done = false;
    var document = false;

    
    phantom.create()
	.then(instance => {
	    phInstance = instance;
	    return instance.createPage();
	})
	.then(page => {
	    sitepage = page;
	    //   return page.open('https://stackoverflow.com/');
	    
	    sitepage.on("onConsoleMessage", function(message, line, src){
		console.log("got message" + message);
		
		consoleMessages.push(message);
		console.log(thisNum + " " + "++++++++++ console message line "+ line + " : "  + message);
		if(message.match(/\[SyntaxError/) || message.match (/\[[a-zA-Z]+Error/)){
		    console.log(new Error().stack);
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
		    sitepage.close();
		    phInstance.exit();
		}
		
		if(message == "c4_done"){
		    
		    console.log("c4_done: format is " + format);
		    
		    if(format == "page"){
			
			sitepage.evaluate(function(){
			    return document.documentElement.outerHTML;
			}).then(function(htmlstring){
			    console.log(thisNum + " " + "11111111 Zzzzzzzzzzzzzzzzzzzzzzzombie done");
			    console.log("got htmlstring");
			    htmlstring = htmlstring.replace(/<!--[^>]+Created using [^>]+Source[^>]+edit[^>]-->/i,"");
			    htmlstring = htmlstring.replace(/<a id="edit-with-js-bin" href="[^"]+" style="top: -60px;">Edit in JS Bin <img src="http:[^"]+"><\/a>/i,"");
			    htmlstring = htmlstring.replace(/<link rel="stylesheet" href="http:\/\/localhost\/jbstatic\/css\/edit.css">/,"");
			    htmlstring = htmlstring.replace(/<style id="jsbin-css">[\s]+<\/style>/,"");
			    // at this point, we just want the contents of the body
			    mongoCache.set(cacheID, htmlstring, {ttl : widgetDoc.cacheConfig.ttl});
			    if(res){
				res.writeHead(200, {'Content-Type': 'text/html', 
						    'Access-Control-Allow-Origin' : '*'});
				res.end(htmlstring);
				delete res;
				sitepage.close();
				phInstance.exit();
			    }
			});
		    }else if (format == "json"){
			var json_text= "{}";
			console.log("getting json element");
			sitepage.evaluate(function(){
			    console.log("in inner funtion");
			    try{
				return document.getElementsByClassName("c4_data").item(0).textContent;
			    }catch(e){
				console.log("ERRROR");
				console.log(e);
				return false;
		 	    }
			}).then(function(_json_text){
			    console.log("have json_element");
			    if(_json_text){
				json_text = _json_text;
				console.log("writing cache to " + cacheID);
				mongoCache.set(cacheID, json_text, {ttl : widgetDoc.cacheConfig.ttl});
			    }
			    
			    if(res){
				console.log("writing res");
				res.writeHead(200, {'Content-Type': 'application/json', 
						    'Access-Control-Allow-Origin' : '*'});
				res.end(json_text);
				delete res;
				sitepage.close();
				phInstance.exit();
			    }
			});
		    }else if (format == "html"){
			var html_text = "";
			sitepage.evaluate(function(){
			    return document.getElementsByClassName("c4_html").item(0).outerHTML;
			}).then(function(_html_text){
			    if(_html_text){
				html_text= _html_text;
				mongoCache.set(cacheID, html_text, {ttl : widgetDoc.cacheConfig.ttl});
			    }
			    if(res){
				res.writeHead(200, {'Content-Type': 'text/html', 
						    'Access-Control-Allow-Origin' : '*'});
				res.end(html_text);
				delete res;
				sitepage.close();
				phInstance.exit();
			    }
			});
		    }
		}
            });
            return page.open(reqUrl);
	})
	.then(status => {
	    console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSStatus");
            console.log(status);
	    return sitepage.property('content');
	    //      return sitepage.property('document');
	})
	.then(content => {
	    //        console.log(content);
	    console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC Content");
	    
	    //        sitepage.close();
	    //        phInstance.exit();
	})
	.catch(error => {
            console.log(error);
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
            phInstance.exit();
	});
    
    
    
    
    console.log("done");
}




/*
Zombie docs here:
https://github.com/assaf/zombie/blob/c638266efd80523c1904ea5d1418aae2e236cce8/README.md#events
*/
