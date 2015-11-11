/*

a proxy and cache for jsbin output.

This bit of code  needs to
- run jsbins server-side
- cache the outs
*/


var Browser = require('zombie');



function runJSBin(jsbin_id){
    var reqUrl = 'http://localhost/jsbin/'+jsbin_id+'/latest';

    var browser = Browser.create();
    browser.on("done", function(document){
        console.log("done");
        var htmlstring = browser.document.documentElement.outerHTML;
        htmlstring = htmlstring.replace(/<!--[^>]+Created using [^>]+Source[^>]+edit[^>]-->/i,"");
        htmlstring = htmlstring.replace(/<a id="edit-with-js-bin" href="[^"]+" style="top: -60px;">Edit in JS Bin <img src="http:[^"]+"><\/a>/i,"");
//        htmlstring = htmlstring.replace(/<a id="edit-with-js-bin" href="[^"]+" style="top: -60px;">Edit in JS Bin <img src="http:[^"]+"><\/a>/i,"");
        console.log(htmlstring);
    });

    browser.visit(reqUrl, function(error){
        if(error){
            console.log("error");
            console.log(error);
        }
    });



    console.log("done");
}



runJSBin("miv");





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