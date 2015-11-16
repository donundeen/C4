ASK YOURSELF: MVP : what's the MINIMUM I need to do to be able to show this to my friendliest code friends?
- it has to have the basics of inter-communication, 
- it needs to have different pages for different art objects


TODOs:
- DONE: MVP: dammit, looks like getting the synchronous stuff working across the board (for easier style of programming, and ease of inter-widget communication) isn't going to work, because zombie doesn't support it.
-- DONE: re-write to use ASYNC for all calls
-- DONE: requires a console message of "c4_done" at the end of every widget run to tell zombie that we're done running
-- DONE: widgetData and widgetHtml methods need a callback function
-- make a function that wraps up ALL the requests into ONE method, with ONE callback, with "insert code" snippet.
- DONE: MVP: need a proxy for calling external webservices
-- then include as a "insert code snippet" bit
- MVP: a bit of UI wrapper around each bin.
-- any other features we want to have act on an individual bin.
- MVP need an image proxy as well.
- MVP: "Widget Name"

- packaging all the code so it's easy to install and run, and to deliver to an app server.
- "Undo" widget deletes 
- details for each widgets
-- human-readable name
-- description
- lock/unlock All widgets at once.
- 'insert code' functionality
- user/group/public access levels on widgets
- do some UI work so it's nice to look at:
-- adjustable size widget divs (or size 1,2,3,4 with Masonry?)
- figure out how to show/hide different panels from the parent window
-- default: load in output-only mode
- access the parent window url from within the code
- widget configuration UI
- make sure jsbin contents are saved at the right times, so no work is ever lost
- some widgets can be easily copied to new pages
-- a basic widget (that outlines the c4-specific features)
-- promoted widgets (that do important stuff)
-- "my favorite widgets"  
-- example widgets
- widgets can be 25%, 50%, 75%, 100% of page width

-- read this for using bootstrap and Meteor, might be a good way to go: http://www.manuel-schoebel.com/blog/meteorjs-and-twitter-bootstrap---the-right-way


- DONE: MVP: "Add Template"
- DONE: MVP: "Save as Template" - useful for debugging and sharing code 
-- DONE: MVP: "Save bin" icon, and remove it from JSBIN UI
- DONE: MVP: need a proxy for calling external webservices
-- GET support DONE
-- DONE for "insert code" functionality, 
-- MVP: "insert code" for getting data from other widgets
- DONE: MVP: support having different pages with different widgets on them 
- DONE: MVP: Concept of "Page Type" that has the same widgets, though the "Page ID" is different.
- DONE: nMVP : implement a URL structure that makes sense, and allows communication btw widgets - DONE
-- DONE: MVP: this will require making sure code runs on the server, but still understand the "Parent Page URL" concept. - DONE
- DONE: MVP: be able to send JSON or HTML outputs from any widget
-- need to look at OUTPUT panel, determine if it's html or json
-- or have HTML, and also a JSON section in comments.
-- needs to be as convenient as possible.
-- DONE: there is a <Script class="c4_data"> for holding JSON, and a <div class="c4_html"> tag for holding html content
- MVP: Execute JSBIN Server-side, so we can get the output post-execution. DONE



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
