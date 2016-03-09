
- Meteor CheatSheet: http://www.webtempest.com/meteor-js-cheatsheet
	- read this for using bootstrap and Meteor, might be a good way to go: http://www.manuel-schoebel.com/blog/meteorjs-and-twitter-bootstrap---the-right-way

UI Ideas:

- Semantic UI: http://semantic-ui.com/
  


TODOs:

- MVP: "page-level"" widgets. This is needed for:
- MVP: "My Widgets" : "saving" widgets adds them to YOUR users/USERNAME page. And they will also show up in the "add widget" dropdown on every page. 
- MVP: functionality for persisting data for a widget on a pageid level. eg, to make a "this object comments" widget, or something like that.
- MVP: elastisearch integration: proxy and helper functions
- MVP: insert code: pageid, pagetype, pageurl
- MVP: Help Text
	- MVP: "How to use this app" - bare minimum
- MVP need an image proxy as well.
- MVP: Make some useful templates and examples
	- a few culutural APIs
- BUG sometimes the jsbin doesn't run on page load, sometimes it doesn't even show.



- dynamically resizable divs
- another layout option: masonry: https://github.com/voodoohop/meteor-masonrify
- per-widget comments, per-widget instance comments.
 	- https://atmospherejs.com/arkham/comments-ui
- confirm delete.
- functionality for getting/setting user session information
- user/group/public access levels on widgets
- re-ordering widgets
- Comments section for each widget.
- "super-minimized widgets" : for widgets that you need to do stuff, but mostly just want hidden.
- in general, need to really ace the way the widget looks in both edit and display modes, and in switching between those modes.
- need a consistent approach to UI for menu. 
- need lots of styling help, so it's veru comfortable to use.
- saving and exporting/importing widgets as mongo data
	- https://themeteorchef.com/recipes/exporting-data-from-your-meteor-application/
	- http://justmeteor.com/blog/backup-and-restore-your-mongodb-database/
- packaging all the code so it's easy to install and run, and to deliver to an app server.
- "Undo" widget deletes 
- promoted widgets (that do important stuff)
- "my favorite widgets"  
	- example widgets
- WYSIWYG HTML Editor, that works in JSBIN


CRAZY IDEAS:



COMPLETED

- BUG - Widget should vertically maximize when in edit mode. - FIXED
- BUG - sometimes web_proxy is returning wrong data set... FIXED
- DONE package.json file
- DONE: MVP: need a proxy for calling external webservices
	- MVP: then include as a "insert code snippet" bit
- BUG: new widget has menu displayed, but isn't fully in Edit mode. Should open up in edit mode.
	- "sort of" fixed
- DONE: user login
- DONE widget configuration UI, for styling.
- DONE: MVP: Headless need to be able to return just the ".c4_html" html or ".c4_data" json, so it can function like an API.
- DONE can we make the icons, the "Waiting" gifs, etc, funny random animated GIFS?
-- eg: http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=waiting
-- use these whenever we call the requireWidgetData function, before the callback
- DONE: MVP: set width and height for widget separate from the rest of the CSS, and pass along to embed code.
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


