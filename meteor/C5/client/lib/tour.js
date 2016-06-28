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

    userFeatures : {
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

    widgetEditing : {
        steps : [
            {
                element : ".help",
                title : "Creating your first widget",
                content : "Now that you've learned a bit about what C5 can do, let's go create a new page and put some widgets on it."+
                "<Br><BR>We're going to go to a new page now, hold tight!"
            },
            {
                path : "/testvaobject_/O89553?tour=widgetEditing&step=1",
                element : ".page_id_div",
                title : "A New Page",
                content : "Now we're on a New Page!"+
                "<BR><BR>This section holds the PAGE NAME, which is made of two parts:"+
                "<BR>1. The <B>Page Type</b>, in this case 'testvaobject_' All pages of the same type have the SAME WIDGETS. So if you add a widget here, it will appear on every page of the same type."+
                "<BR>2. The <b>Page ID</b>, in this case O89553, which happens to the the unique identifier for an object from the Victoria &amp; Albert Museum."+
                "<BR><BR>Every widget has access to these values, through the functions pageType() and pageId()."+
                "<BR><BR>Note: We CREATED this page Type just by going to the URL testvaobject_/something. Just start adding widgets, and you're good to go!",
                onNext : function(tour){console.log("next clicked"); tour.goTo(2);}

            },
            {
                element : ".widgetlibrary",
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
                            copyWidgetToPage("ciy", pageinfo().pagetype, pageinfo().pageurl, pageinfo().pageid );
                            $(".addFromWidgetLibraryUL").toggle();
                            setTimeout(function(){
                               // document.location.href= "/testvaobject/O89553?tour=widgetEditing&step=3";
                               console.log("going to 3");
                                tour.start(true);
                                tour.goTo(3);
                            }, 2000);
                        }, 2000);
                    }, 2000);
//                    return (new jQuery.Deferred()).promise();
                }
            },
            /*
            
            {
             //   path : "/testvaobject/O89553?tour=widgetEditing&step=3",
                element : ".widget-name-editmode:first",
                title : "Your First Widget",
                content : "Congrats ! You've created a widget of your very own!"+
                "<Br><BR>You'll notice it's grey, which means it's private; only you can see it right now." +
                "<BR><BR>If you click on the little lock icon here, you'll open it for editing."+
                "<BR><BR><i>Right now, just click 'next' and we'll do it for you (make sure your browser window is maximized first, please).</i>",
                onNext: function(tour){
                    tour.end();
                    $(".widgetUnlock:first").trigger("click");
                    tour.start();
                    tour.goTo(4);
                }
            },
            */
            
            {
                element : ".navbar-brand:first",
                title : "Edit Mode!",
                content : "Welcome to Edit Mode!"+
                "<BR><BR>"
            }
        ]
    }
}




Template.widget.onRendered(function(){

    if(!this.rendered){
        setupTour(".clickForIntroTour", tours["intro"]);
        setupTour(".clickForUserFeaturesTour", tours["userFeatures"]);
        setupTour(".clickForWidgetEditingTour", tours["widgetEditing"]);
    }else{
        console.log("not attaching");
    }
});


Template.body.onRendered(function(){
    if(!this.rendered){
        console.log("attaching for body");
        setupTour(".clickForWidgetEditingTour", tours["widgetEditing"]);
        console.log("attaching");
        var uri = parseUri(window.location.href);
        if(uri.queryKey && uri.queryKey.tour){
            console.log("loading tour, gonna run " + uri.queryKey.tour)
            var tourname = uri.queryKey.tour;
            var step = uri.queryKey.step;
            runTour(tours[tourname], step);
        }
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



