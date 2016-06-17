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
                "<BR><BR>We start you out with a few basics, but you can build up your own library by copying any other widget to it."++
                "<BR><br>Then you can add widgets from your library to any Page";
            },
            {
                element : ".save_to_library",
                title : "Copy a Widget to Your Library",
                content : "Click this icon to add this widget to your library",
            }

        ]
    }
}




Template.widget.onRendered(function(){

    if(!this.rendered){
        setupTour(".clickForIntroTour", tours["intro"]);
        console.log("attaching");
        var uri = parseUri(window.location.href);
        if(uri.queryKey && uri.queryKey.tour){
            var tourname = uri.queryKey.tour;
            var step = uri.queryKey.step;
            runTour(tours[tourname], step);
        }
    }else{
        console.log("not attaching");
    }
});


function runTour(tourdata, step){
    (function(_tourdata, _step){
        $(document).ready(function(){
            var tour = new Tour(_tourdata);
            tour.init();
            tour.start(true);
            tour.goTo(step);
        });
    })(tourdata, step);
}


function setupTour(element, tourdata){
    (function(_tourdata, _element){
        $(document).ready(function(){
            var tour = new Tour(_tourdata);
            tour.init();
            (function(_tour, __element){
                $(__element).click(function(){
                    _tour.start(true);
                    _tour.goTo(0);
                });
            })(tour, _element);
        });
    })(tourdata, element);
}



