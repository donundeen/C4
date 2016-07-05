/*

a proxy and cache for persisting data.

This bit of code  needs to
- run jsbins server-side
- cache the outs

https://github.com/assaf/zombie

*/

    
var urlparser = require("url");

var fs = require("fs");
var pathparser = require("path");
var http = require("http");

var mysecrets = {port: 3016, prod_port: 3016};

var port = mysecrets.port;
if(process && process.env && process.env.NODE_ENV == "production"){
    port = mysecrets.prod_port;
}
var mongoport = 27017;
if(process.env.MONGOPORT){
    console.log("overriding MONGOPORT to " + process.env.MONGOPORT);
    mongoport = process.env.MONGOPORT;
}

var MongoClient = require('mongodb').MongoClient;

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
    
    var parsed = urlparser.parse(req.url, true);
    var query = urlparser.parse(req.url, true).query;

    var split = parsed.path.split("/");
    var id = split[split.length - 1];


    if (req.method == 'POST') {

        console.log("processing POSt");
        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = JSON.parse(body);

            saveData(id, post, function(result, err){
                res.writeHead(200, {'Content-Type': 'application/json', 
                              'Access-Control-Allow-Origin' : '*'});
                res.end(JSON.stringify({response : result, error: err}));
            });
        });
    }
    if(req.method == "GET"){
        getData(id, function(result, err){
            res.writeHead(200, {'Content-Type': 'application/json', 
                          'Access-Control-Allow-Origin' : '*'});
            res.end(JSON.stringify({response : result, error: err}));
        });

    }
}


function saveData(id, data, callback){
    data._id = id;
    var connString = "mongodb://localhost:"+mongoport+"/meteor";
    MongoClient.connect(connString, function(err, db) {
        console.log("connected");
        console.log("error : " +  err);
        if(err){
            callback(false, err);
            return;
        }
        db.collection("widget_persistence").save(data, function(err, result) {
            if(err){
                console.log(err);
                callback(false, err);
            }else{
                callback(result, false);
            }
        });
    });
}

function getData(id, callback){
    MongoClient.connect("mongodb://localhost:"+mongoport+"/meteor", function(err, db) {
//        console.log("connected");
//        console.log("error : " +  err);
        if(err){
            console.log("error : " +  err);
            callback(false, err);
            return;
        }
        db.collection("widget_persistence").findOne({_id : id  }, function(err, doc){
            var widgetDoc = {};
            if(err){
                console.log(err);
                callback(false, err);
            }else{
                callback(doc, false);
            }
        });
    });
}

