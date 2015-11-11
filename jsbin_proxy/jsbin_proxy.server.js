/*

a proxy and cache for jsbin output.

This bit of code  needs to
- run jsbins server-side
- cache the outs
*/

var request = require("request");



var Browser = require('zombie');



runJSBin("goq");


function runJSBin(jsbin_id){
    var reqUrl = 'http://localhost/jsbin/'+jsbin_id+'/latest';

    Browser.on("loaded", function(document){
        console.log(document);
    });

    Browser.visit(reqUrl);
    console.log("done");
}


function processJSBin(jsbin){
    var html = jsbin.html;
    var css = jsbin.css;
    var js = jsbin.javascript;

}


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