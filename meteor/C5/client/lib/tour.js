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
                content : "Welcome to the Tour of C5. <BR> This is the home button. Click here to come back to the home page. <BR><BR> <i>Stay tuned for a more full-fledged tour, and individualized tours for specific features.</i>"
            }
        ]
    }
}

setupTour(".clickForIntroTour", tours["intro"]);


var uri = parseUri(window.location.href);
if(uri.queryKey && uri.queryKey.tour){
    var tourname = uri.queryKey.tour;
    var step = uri.queryKey.step;
    runTour(tours[tourname], step);
}

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
                });
            })(tour, _element);
        });
    })(tourdata, element);
}



