__C5__
-

Collaborative Creative Coding with Cultural Commons

C5 is a web-based coding environment, leveraging JsBin to make it easy to create, share, and reuse code that uses museum APIs.

It's currently in friends-only beta, because it has rough edges that need some explaining before it's useful.

__HOW IT WORKS__
-

A C5 __PAGE__ is made up of __WIDGETS__. 

Each __WIDGET__ is an embedded JsBin, in which the HTML, CSS, and Javascript can be live edited. 

Once logged in, anyone can add a widget to a page, or copy an existing widget to the same page. Users can edit only the widgets they create.

A C5 __PAGE__ has two main identifiers:

- the __PAGE_TYPE__ : all pages with the same page type have the same widgets. An example of a page type is "MetArtObject" or "DonsSearch". You can create a new Page type just by typing in the url, eg. http://c5domain.com/MetArtObject/ 
- The __PAGE_ID__ : the PAGE_ID is the unique identifier for that page, within that type. For example, 1992.a.1-3 an accession number for a Met Art Object. That would be at url: http://c5domain.com/MetArtObject/1992.a.1-3 . 
- Every widget has access to those two variables, through the functions:
  - pagetype() 
  - pageid()

The other clever thing that Widgets can do is get data or html from each other. 

Each widget has a special script tag with the class "c5_data". JSON placed in this tag is "this widget's data," which is accessible via a special url, and also from a special function in the javascript (more details on this available in the HOWTOs).

Similarly, each widget has a special div with the class "c5_html". Anything in this widget is available at a special url, or via a special function in the javascript.



__INSTALLING__
-


Ok, so that's a little tricky right now, though all the files you need are in this repo.

Architecturally, C5 is made up of:

- A Meteor App: this runs the front end UI, and holds the database
- A JsBin Server: JsBin is the live-coding environment, which does the heavy lifting for every widget. It stores the JsBin widget code, and executes it-client side
- a bunch of proxies:
  - jsbin_proxy : this proxy runs jsbin server-side, using PhantomJs. This is so you can call widgets from other widgets (or other apps entirely), and get back the output, without JsBin running in the browser
  - web_proxy : you usually can't call a remote Museum API from the browser, so this web proxy routes client-side calls through the server. It uses a rate-limiter and a cache to avoid ticking off museum IT departments.
  - image_proxy : similarly, there are things you'd like to do with an image that you can't do cross-domain. Image_proxy helps with this.
- nginx web server, to handle all the proxying
 
To install all of these, and getting them playing nicely, requires a bit of configuration. You can look at my examples in server_configs, and the startup script I use in ./scripts. 

Some of the proxies require different versions of Node, so you need to use NVM. 

More documentation on this coming.


TODOs:

See issues in github for new TODOs

http://github.com/donundeen/C5


