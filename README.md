TODOs:
- make sure jsbin contents are saved at the right times, so no work is ever lost
- do some UI work so it's nice to look at:
-- adjustable size widget divs (or size 1,2,3,4 with Masonry?)
- figure out how to show/hide different panels from the parent window
- access the parent window url from within the code
- 'insert code' functionality
-- needs to be as convenient as possible.
- implement a URL structure that makes sense
- widget configuration UI



paths and ports and things

Mongo runs on Port 3001

Meteor
port: 3000

nginx
port 80
{PATH_TO}/C4/server_configs/nginx/nginx.conf
- start with sudo nginx -c {PATH_TO}/C4/server_configs/nginx/nginx.conf




jsbin
{PATH_TO}/server_configs/jsbin/config.local.json 
PORT=3003 JSBIN_CONFIG={PATH_TO}/server_configs/jsbin/config.local.json JSBIN_PROXY=on jsbin &

jsbin API
(port 3002)
{PATH_TO}/server_configs/jsbin/config.api.json 
JSBIN_CONFIG={PATH_TO}/server_configs/jsbin/config.api.json jsbin &


getting data from one bin into another:


console.clear();

$.ajax({
  //* 1. get the JSON representation of the bin
  url: '//localhost/jsbin/goq/latest',
  dataType: 'json',
  //*/
  
  /* 2. get the full HTML output of the bin
  url: '//localhost/jsbin/goq/latest.html',
  dataType: 'html',
  
  // 2.1. including this header gets the HTML *without* the "edit in jsbin"
  headers: { 'x-requested-with': 'XMLHttpRequest' },
  //*/
  
  /* 3. get the JavaScript panel as JSON
  url: '//localhost/jsbin/goq/latest.json',
  dataType: 'json',
  //*/ // note, this depends on that entire js panel being a JSON object. 
  // we need a way for an object get DATA from another panel, whether it is JSON or HTML
  // probably should use OUTPUT panel, but let people put JSON data in in, along with the HTML, then split it out with the import functions...
  
  success: function (result) {
    console.log("got success");
    console.log(result);
  },
  error: function (xhr, status, error) {
    console.log("got error");
    console.error(error);
    console.log(status);
  }
});



Mod to /usr/local/lib/node_modules/jsbin/lib/handlers/bin.js

line 238, 239:
//        this.getBinPreview(req, res); // commented out by donundeen
        realthis.getBinPreview(req, res); // added by donundeen

line 188
  var realthis = this; // added by donundeen 
