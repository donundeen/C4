// app tour
// see http://bootstraptour.com/api/

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
function parseUri (str) {
    var o   = parseUri.options,
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri; 
};

parseUri.options = {
    strictMode: false,
    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
    q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};


var testPageType = "testvaobject";
if(Meteor.userId()){
    testPageType += "_"+Meteor.userId();
}
var testPageId = "O89553";

var tours = {
    "intro" : {
        steps : [
            {
                path : "/?tour=intro&step=0",
                element : ".titleBox",
                title : "This is C5",
                content : "Welcome to the Tour of C5. <BR> <BR> " +
                "<B>C5</b> stands for <i>Collaborative Creative Coding with Cultural Commons.</i>  " +
                "It's designed to make it fun and easy to create, share, and re-use code that does interesting stuff with Open Data from Museums and other cultural institutions. " +
                "<BR><BR> " +
                "This is the home button. Click here to come back to the home page. ",
                onNext : function(tour){console.log("next clicked"); tour.goTo(1);}
            },
            {
                element : ".widgetContainer:first",
                title : "It's All Widgets!",
                content : "C5 Pages are made up of <B>Widgets</b>, which you can add to any page. <BR>A Widget is a unit of HTML/CSS/Javascript, which can be live-edited by whomever created it.",
            },
            {
                element : ".pagecomments",
                title : "Comments",
                content : "Something you like? Don't Like? Have an idea for a widget, and need some help? <BR><BR>"+
                "You can leave attach comments to:"+
                "<ul><li>A specific page,</li><li>All pages of the same <b>Page Type</b>,</li><li>Or to individual widgets</li></ul>"+
                "<BR><BR><i>'Page Type? What's that?' We'll get into that stuff in the next Tour!</i>"
            },
            {
                element : ".widgetcomments:first",
                title : "Widget Comments",
                content: "You can also leave comments on individual widgets, for" + 
                "<ul><li>The specific instance of this widget on this page, or</li><li>This widget on all pages of the same type</li>"
            },
            {
                element : ".widgetinfo:first",
                title : "Widget Info and URLs",
                content : "If you click on the info icon, you'll see that every widget has a JSON and HTML endpoint URL." +
                "This means you can access the output of ANY widget, as data or presentation, from ANYWHERE -- From other widgets, other pages, or even totally independant applications<BR>"+
                "<BR><b>This means you can prototype your own Apps right here in C5!</b>"
            },
            {
                element : ".login:first",
                title : "Join up!",
                content : "Feel free to cruise the site without logging in. You can check out all the cool stuff other people have made, use the search feature, and play with widgets that have interactive bits.<BR><BR> " +
                "But once you create an account, you'll be able to add widgets, copy other people's widgets, contribute comments, create your own libraries of widgets, and in general do all the things.<BR><BR>" +
                "Log in now, and some new tours will be made available, so you can get started creating!",
            }
        ]
    },

    "userFeatures" : {
        steps : [
            {
                path : "/?tour=userFeatures&step=0",
                element : ".widgetlibrary",
                title : "The Widget Library",
                content : "Now that you've logged in, you'll notice there's some new features available." +
                "<BR><BR>This is the <b>Widget Library</b>"+
                "<BR>Select a widget from here, and it appears on the page, initially as a 'private widget' that only you can see."+
                "<BR><BR>We start you out with a few basics, but you can build up your own library by copying any other widget to it."+
                "<BR><br>Then you can add widgets from your library to any Page",
                onNext : function(tour){console.log("next clicked"); tour.goTo(1);}
            },
            {
                element : ".save_to_library:first",
                title : "Copy this Widget to Your Library",
                content : "Click this icon to add this widget to your library",
            },
            {
                element : ".copy:first",
                title : "Copy a widget to this page",
                content : "Click this icon to create a new version of this widget on the same page",
            },
            {
                element : ".link_to_library",
                title : "link to your library",
                content : "click here to go to a special page that holds all the widgets in your library."
            }

        ]
    },

    "widgetEditing" : {
        orphan : true,
        steps : [
            {
                element : ".help",
                title : "Creating your first widget",
                content : "Now that you've learned a bit about what C5 can do, let's go create a new page and put some widgets on it."+
                "<Br><BR>We're going to go to a new page now, hold tight!"
            },
            {
                path : "/"+testPageType+"/"+testPageId+"?tour=widgetEditing&step=1",
                element : ".page_id_div",
                title : "A New Page",
                content : "Now we're on a New Page!"+
                "<BR><BR>This section holds the PAGE NAME, which is made of two parts:"+
                "<BR><BR>1. The <B>Page Type</b>, in this case '"+testPageType+"' All pages of the same type have the SAME WIDGETS. So if you add a widget here, it will appear on every page of the same type."+
                "<BR><BR>2. The <b>Page ID</b>, in this case '"+testPageId+"', which happens to the the unique identifier for an object from the Victoria &amp; Albert Museum."+
                "<BR><BR>Put another way, the Page Type is like the 'class' in Object-oriented programming. The PageType + PageID is like the 'instance' of that class."+
                "<BR><BR>Or putting it another way: you make a PageType for a set of objects that you get from the same API. Like V&amp;A API."+
                "<BR><BR>Note: We CREATED this page Type just by going to the URL '"+testPageType+"/something'. Just start adding widgets, and you're good to go!",
                onNext : function(tour){
                    console.log("next clicked"); 
                    tour.goTo(2);
                }

            },
            {
                element : ".widgetlibrary",
                placement : "left",
                title : "Add a Widget to this page",
                content : "The first thing we want to do is add a widget to this page, by copying a basic widget example from the Library." +
                "<BR><BR>Let's grab the 'Webservice Search Example.' That's a good starting point."+
                "<BR><BR><i>Just click 'next', and we'll select it for you<i>",
                onNext : function(tour){
                    tour.end();
                    $(".addFromWidgetLibraryUL").toggle();
                    setTimeout(function(){
                        $(".copy_from_template.ciy").mouseover();
                        setTimeout(function(){
                            $(".copy_from_template.ciy").mouseout();
                            copyWidgetToPage("ciy", pageinfo().pagetype, pageinfo().pageurl, pageinfo().pageid );
                            $(".addFromWidgetLibraryUL").toggle();
                            setTimeout(function(){
                                tour.start(true);
                                tour.goTo(3);
                            }, 2000);
                        }, 2000);
                    }, 2000);
//                    return (new jQuery.Deferred()).promise();
                }
            },
            {
             //   path : "/testvaobject/O89553?tour=widgetEditing&step=3",
                element : ".widgetUnlock:first",
                title : "Your First Widget",
                content : "Congrats ! You've created a widget of your very own!"+
                "<Br><BR>You'll notice it's grey, which means it's private; only you can see it right now." +
                "<BR><BR>If you click on the little lock icon here, you'll open it for editing."+
                "<BR><BR>Now, <B>Click the Lock Icon to the Left</b>, THEN click 'Next' below.",
                /*
                onNext : function(tour){
                    tour.end();
                    $(".widgetUnlock:first").trigger("click");
                    setTimeout(function(){
                        tour.start(true);
                        tour.goTo(4);
                        console.log("went");
                    }, 2000);
                }
                */
            },
            
            {
                element : ".widgetLock.editmodeonly:first",
                title : "Edit Mode",
                placement : "left",
                content : "<B>Welcome to Edit Mode</b>"+
                "<BR><BR>Now we're cooking"+
                "<BR><BR>If you've ever used <a href='http://jsbin.com'>JsBIN</a>, <a href='http://jsfiddle.net'>JsFiddle</a>, or <a href='http://codepen.io'>CodePen</a>, this should look familiar."+
                "<br>In fact, a widget is just an embedded JsBin, with come helpful glue to make the widgets talk to each other."+
                "<BR><BR>Try editing the html panel on the left, and you'll see the output code on the right update in real time."
            },

            {
                element : ".setpublic:first",
                title : "Private Widget",
                placement : "left",
                content : "Right now this widget is PRIVATE, meaning only you can see it."+
                "<BR><BR>So feel free to muck about."+
                "<BR><BR>When you're ready to share it with the world, click the icon to make it public."
            },

            {
                element : ".widgetinfo-editmode:first",
                title : "Widget Info",
                content : "Click this to get info about the Widget, such as:"+
                "<BR>- Editable name and description" +
                "<BR>- Data and HTML Urls"
            },
            
            {
                element : ".widgetactions:first",
                title : "Widget Actions",
                content : "Click this to perform actions like Save, Delete, and Adding to your Library."

            },
            {
                element : ".widgetpulldata:first",
                title : "Pull Data",
                content : "This section has super useful helper functions that help you access data from other widgets on this page"+
                "<BR><BR>More on this in a bit!"
            },
            
            {
                element : ".widgetstylesettings:first",
                title : "Widget Style",
                content : "Using this menu item, you can edit the style of the widget container, like the width and height of the widget, border color, etc",
            },

            {
                element : ".widgetcachesettings:first",
                title : "Cache Settings",
                content : "Here you can set how long you want to cache the output of this widget"+
                "<BR><BR>If your input doesn't change very often, it's good to set this pretty high,"+
                "it will really help with performance."
            },


            {
                element : ".widgetorder:first",
                title : "Widget Order",
                content : "Edit this value to re-order your widget on the page."
            },

/*            


            {
                element : ".widgetorder:first",
                title : "Widget Order",
                content : "Edit this value to re-order your widget on the page."
            },
         
            {
                element : ".page_id_div",
                title : "End of tour",
                content : "Thanks for taking the tour."+
                "<BR><BR>Please send questions to donundeen@gmail.com,"+
                "or post them a <a href='http://github.com/donundeen/C5'>On our github page</a>",
            }
        */
            
        ]
    }
}



/*
Template.widget.onRendered(function(){

    if(!this.rendered){
        setupTour(".clickForIntroTour", tours["intro"]);
        setupTour(".clickForUserFeaturesTour", tours["userFeatures"]);
        setupTour(".clickForWidgetEditingTour", tours["widgetEditing"]);
    }else{
        console.log("not attaching");
    }
});
*/

Template.help.onRendered(function(){
    if(!this.rendered){
        console.log("attaching for help");

        setupTour(".clickForUserFeaturesTour", tours["userFeatures"]);
        this.rendered = true;
    }

});

Template.body.onRendered(function(){

    if(!this.rendered){
        console.log("attaching for body");
        setupTour(".clickForIntroTour", tours["intro"]);
        
        setupTour(".clickForWidgetEditingTour", tours["widgetEditing"]);
//        setupTour(".clickForUserFeaturesTour", tours["userFeatures"]);
        
        console.log("attaching");
        var uri = parseUri(window.location.href);
        if(uri.queryKey && uri.queryKey.tour){
            console.log("loading tour, gonna run " + uri.queryKey.tour)
            var tourname = uri.queryKey.tour;
            var step = uri.queryKey.step;
            runTour(tours[tourname], parseInt(step, 10));
        }
        this.rendered = true;
    }else{
        console.log("not attaching");
    }
});






function runTour(tourdata, step){
    console.log("running tour ");
    console.log(tourdata);
    (function(_tourdata, _step, _jquery){
        $(document).ready(function(){
            console.log("starting");
            var tour = new Tour(_tourdata);
            tour.jquery = _jquery;
            tour.init();
            tour.start(true);
            tour.goTo(step);
        });
    })(tourdata, step, $);
}


function setupTour(element, tourdata){
    console.log("seeting up tour " + element);
    console.log(tourdata);
    console.log($(element));
    (function(_tourdata, _element, _jquery){
        $(_element).click(function(){
            console.log("running tour");
            var tour = new Tour(_tourdata);
            tour.jquery = _jquery;
            tour.init();
            tour.start(true);
            tour.goTo(0);
        });
    })(tourdata, element, $);
}


/*
function setupTour(element, tourdata){
    (function(_tourdata, _element, _jquery){
        $(document).ready(function(){
            var tour = new Tour(_tourdata);
            tour.jquery = _jquery;
            tour.init();
            (function(_tour, __element){
                $(__element).click(function(){
                    _tour.start(true);
                    _tour.goTo(0);
                });
            })(tour, _element);
        });
    })(tourdata, element, $);
}
*/


