
- Meteor CheatSheet: http://www.webtempest.com/meteor-js-cheatsheet
	- read this for using bootstrap and Meteor, might be a good way to go: http://www.manuel-schoebel.com/blog/meteorjs-and-twitter-bootstrap---the-right-way

UI Ideas:

- Semantic UI: http://semantic-ui.com/
  

using this font library

- https://atmospherejs.com/ixdi/material-design-iconic-font
- https://materialdesignicons.com/
- http://zavoloklom.github.io/material-design-iconic-font/examples.html
- cheatsheet here: http://zavoloklom.github.io/material-design-iconic-font/cheatsheet.html#alert



TODOs:
- MVP: Make a How-To Video
- BUG: problems with multiple nested jsbin_proxy calls - or maybe just hard-to-debug problems in the widget code?
- Comment Replies broken?
- MVP: functionality for persisting data for a widget on a pageid level. eg, to make a "this object comments" widget, or something like that.
-- requires a "persistence proxy" - store to mongo
- BUG: there's a BUG when requireWidgetData wants the data and html output of a widget.
- MVP: elastisearch integration: proxy and helper functions
- MVP: insert code: pageid, pagetype, pageurl
- MVP: Help Text
	- MVP: "How to use this app" - bare minimum
- MVP: Make some useful templates and examples
	- a few culutural APIs
- BUG sometimes the jsbin doesn't run on page load, sometimes it doesn't even show.
- MVP: email support:
-- watching widgets/pages
-- notifications on comments
- Twitter Cards



- creating and sharing "code snippets" as well as entire widgets
- dynamically resizable divs (drag corners), or masonry implementation, or something to make the boxes tend to fit together better.
- another layout option: masonry: https://github.com/voodoohop/meteor-masonrify
- confirm delete.
- functionality for getting/setting user session information
- user/group/public access levels on widgets
- in general, need to really ace the way the widget looks in both edit and display modes, and in switching between those modes.
- need a consistent approach to UI for menu. 
- need lots of styling help, so it's veru comfortable to use.
- saving and exporting/importing widgets as mongo data
	- https://themeteorchef.com/recipes/exporting-data-from-your-meteor-application/
	- http://justmeteor.com/blog/backup-and-restore-your-mongodb-database/
- packaging all the code so it's easy to install and run, and to deliver to an app server.
- "Undo" widget deletes 
- promoted widgets (that do important stuff)
- WYSIWYG HTML Editor, that works in JSBIN


Widget Ideas

- WYSIWYG text widget
- freehand drawing 
- keyword/vocabulary creation/editing


CRAZY IDEAS:

- elsticsearch config: https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-http.html
- Packery: http://packery.metafizzy.co/

COMPLETED
- FIXED Bug: "copy" and "save to library" icons appear even when user is not logged in.

- FIXED "code snippets" - not a great term for what it's doing right now. - how about "get data" - and a separate dropdown for "code "
- DONE: MVP need an image proxy as well.
- DONE: implement caching : https://www.npmjs.com/package/cache-manager

- DONE: per-widget comments, per-widget instance comments.
 	- https://atmospherejs.com/arkham/comments-ui
- DONE: Sort Order
- DONE: MVP: "page-level"" widgets. This is needed for:
- DONE: MVP: "My Widgets" : "saving" widgets adds them to YOUR users/USERNAME page. And they will also show up in the "add widget" dropdown on every page. 
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


