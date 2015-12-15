ASK YOURSELF: MVP : what's the MINIMUM I need to do to be able to show this to my friendliest code friends?
- it has to have the basics of inter-communication, 
- it needs to have different pages for different art objects

Meteor CheatSheet: http://www.webtempest.com/meteor-js-cheatsheet
-- read this for using bootstrap and Meteor, might be a good way to go: http://www.manuel-schoebel.com/blog/meteorjs-and-twitter-bootstrap---the-right-way

UI Ideas:
Semantic UI: http://semantic-ui.com/
  


TODOs:
- MVP: set width and height for widget separate from the rest of the CSS, and pass along to embed code.
- MVP: Headless need to be able to return just the ".c4_html" html or ".c4_data" json, so it can function like an API.
- DONE: MVP: need a proxy for calling external webservices
-- MVP: then include as a "insert code snippet" bit
- MVP need an image proxy as well.
- MVP: Help Text
-- MVP: "How to use this app" - bare minimum
- MVP: Make some useful templates
-- a few culutural APIs


- in general, need to really ace the way the widget looks in both edit and display modes, and in switching between those modes.
- need a consistent approach to UI for menu. 
- need lots of styling help, so it's veru comfortable to use.
- saving and exporting/importing widgets as mongo data
-- https://themeteorchef.com/recipes/exporting-data-from-your-meteor-application/
-- http://justmeteor.com/blog/backup-and-restore-your-mongodb-database/
- functionality for persisting data for a widget on a pageid level. eg, to make a "this object comments" widget, or something like that.
- packaging all the code so it's easy to install and run, and to deliver to an app server.
- "Undo" widget deletes 
- 'insert code' functionality
- user/group/public access levels on widgets
- widget configuration UI, for styling.
- promoted widgets (that do important stuff)
- "my favorite widgets"  
-- example widgets
- re-ordering widgets: 
- "lock" code that someone else is editing. concurrent editing would be cool, though..
-- we'll save this for post-MVP, and ask people to be careful


- DONE: MVP: A decent menu system for UI.
-- DONE: using a simple bootstrap menu for now.
- DONE: MVP: hide all menu in display mode
- DONE: MVP: Widget Description
- DONE: MVP: auto-save feature
-- requires detecting changes in jsbin editor panels
-- or, save on close?
- DONE MVP: make the system work even if the pageid, or the pagetype, isn't set (use empty string)
-- this will make it possible to create a "home page"  which will be hella useful.
- DONE icon :hover changes
- MVP: widgets run on page load
-- this seems to be the case already?
- DONE: MVP: make a function that wraps up ALL the requests into ONE method, with ONE callback,
-- DONE: MVP:  with "insert code" snippet.
- DONE MVP: hide edit options on widget lock.
- DONE: MVP: tooltips on icons.
- DONE: MVP: "Widget Name"
- DONE: MVP: a bit of UI wrapper around each bin.
- DONE: MVP: dammit, looks like getting the synchronous stuff working across the board (for easier style of programming, and ease of inter-widget communication) isn't going to work, because zombie doesn't support it.
-- DONE: re-write to use ASYNC for all calls
-- DONE: requires a console message of "c4_done" at the end of every widget run to tell zombie that we're done running
-- DONE: widgetData and widgetHtml methods need a callback function
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
