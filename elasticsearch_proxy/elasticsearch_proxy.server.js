var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

/*
client.ping({
  // ping usually has a 3000ms timeout 
  requestTimeout: Infinity,
 
  // undocumented params are appended to the query string 
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

client.index({
  index: 'sample',
  type: 'document',
  id: '1',
  body: {
          name: 'Reliability', 
          text: 'Reliability is improved if multiple redundant sites are used, which makes well-designed cloud computing suitable for business continuity.'
  }
}, function (error, response) {
    if(error){
        console.log("index error");
        console.log(error);
    }
  console.log(response);
});



client.search({
        index: 'sample',
        type: 'document',
        body: {
            query: {
                query_string:{
                   query:"Reliability"
                }
            }
        }
    }).then(function (resp) {
        console.log("got result from search");
        console.log(JSON.stringify(resp, null, "  "));
    }, function (err) {
        console.log(err.message);
    });





*/

var urlparser = require("url");

var fs = require("fs");
var pathparser = require("path");
var http = require("http");

var qs = require("querystring");

var request = require("request");

var mysecrets = {port: 3010};

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


    if(req.method == 'GET'){
      
    }

    if (req.method == 'POST') {
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
            console.log(JSON.stringify(post, null, " "));

            client.index({
              index: 'c5',
              type: post.type,
              id: post.id,
              body: post.data
            }, function (error, response) {
                if(error){
                    console.log("index error");
                    console.log(error);
                }
              console.log(response);
              res.writeHead(200, {'Content-Type': 'application/json', 
                                  'Access-Control-Allow-Origin' : '*'});
              res.end(JSON.stringify({response : response, error: error}));

            });


        });
    }

}

