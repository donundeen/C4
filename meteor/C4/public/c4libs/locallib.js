var c4_widget_cache = {};



function pageId(){
    // get parent url, figure out the "page id"
//    console.log(window.parent.parent.parent.location.href);
    var search= window.parent.parent.location.search;
    var pageid = "";
    try{
        console.log("searching " + search);
        var results = /.*pageid=([^\&]+)/.exec(search);
        if(results){
            pageid = results[1];
        }

        console.log(" got pageid " + pageid);
        pageid = pageid.replace(/\:script/, "");

        console.log("locallib pageid " + pageid);        
    }catch(e){
        var pathname = window.location.pathname;
        var split = pathname.split("/");
        console.log(split);
        split.shift();
        var next = split.shift();
        if(next == "headless"){
            split.shift();
        }
        var pageurl =  split.join("/");    

        var pagetype = split.shift();
        if(split.length > 0){
            pageid = split.shift();
        }
        pageid = pageid.replace(/\:script/, "");

        console.log("locallib returning pageid " + pageid);

    }
    return pageid;
}

function pageid(){
    return pageId();
}

function pageType(){
    // get parent url, figure out the "page id"
//    console.log(window.parent.parent.parent.location.href);
    var search= window.parent.parent.location.search;
    var pagetype = "";
    try{
        var results = /.*pagetype=([^\&]+)/.exec(search);
        if(results){ 
            pagetype = results[1];
        }
    }catch(e){
        var pathname = window.location.pathname;
        var split = pathname.split("/");
        split.shift();
        var next = split.shift();
        if(next == "headless"){
            split.shift();
        }
        var pageurl =  split.join("/");    
        if(split.length > 0){
            pagetype = split.shift();
        }
    }
    return pagetype;
}

function pagetype(){
    return pageType();
}

function purgeWidgetCache(widgetName, callback){
    if(!widgetName){
        c4_widget_cache = {};
    }
    else{
        delete c4_widget_cache[widgetName];
    }
}

function c4_done(){
    console.log("c4_done");
}

function widgetData(widgetName, callback){
    getOutputFromWidget(widgetName, function(result){
        if(!result){
            callback(false);
            return false;
        }
        var newdiv = $("<div>");
        $(newdiv).append(result);
        var datastring = $(".c4_data", newdiv).text().trim();
        try{
            var newObj = JSON.parse(datastring);
            callback(newObj);
        }catch(e){
            console.log("error parsing data");
            console.log(datastring);
            console.log(e);
            callback(false);
        }
    });
}

function widgetHtml(widgetName, callback){
    getOutputFromWidget(widgetName, function(result){
        if(!result){
            callback(false);
            return false;
        }
        var newdiv = $("<div>");
        $(newdiv).append(result);
        var c4_html = $(".c4_html", newdiv);
        callback(c4_html);
    });
}


function getOutputFromWidget(widgetName, callback){

    if(c4_widget_cache[widgetName]){
        callback(c4_widget_cache[widgetName]);
        return true;
    }
    var reqUrl = '/headless/'+widgetName+'/'+pageType()+"/"+pageId();
    console.log("calling " + reqUrl);
    $.ajax({
        url: reqUrl,
        dataType: 'html',
        success : function(result){
            console.log("got result");
            console.log(result);
            c4_widget_cache[widgetName] = result;
            callback(result);
        },
        error : function (xhr, status, error) {
            console.log("got error");
            console.log(error);
            console.log(status);
            callback(false);
        }
    });
    return true;
}


function webserviceData(url, callback, item){
    var theurl = "/web_proxy/?url="+encodeURI(url);
    console.log("....calling webservice url " + theurl);
    var data = {lookatme :  "kanye"};
    if(item.authentication_token){
        data.headers = JSON.stringify({'Authorization':'Token token=' + item.authentication_token});
    }
    $.ajax({
        url: theurl,
        dataType: 'json',
        data: data,
        success : function(result){
            console.log("got result for call to " + theurl);
            callback(result);
        },
        error : function (xhr, status, error) {
            console.log("webserviceData  got error");
            console.log(error);
            console.log(status);
            callback(false);            
        }
    });
    console.log("called webserive url");
}


var gifRemoved = false;
function createWaitingGif(){
    var imgtag = $("<div class='waitinggif'><img class='waitinggif' src='/giphy_proxy/waiting'></div>");
    $("body").prepend(imgtag);
}



function removeWaitingGif(){

    gifRemoved = true;
    console.log("removing");
    $(".waitinggif").remove();
}

function requireWidgetData(requiresList, callback){
    console.log("in requireWidgetData");

    if(!window.location.href.match(/headless=true/)){
        createWaitingGif();
    }
    var length = requiresList.length;
    var funcscomplete = 0;
    var resultsSet = {};
    if(length == 0){
        removeWaitingGif();
        callback(resultsSet);
    }
    $.each(requiresList, function(index, item){
        console.log(item);
        if(item.type == "data"){
            widgetData(item.from, function(response){
                if(!resultsSet[item.from]){
                    resultsSet[item.from] = {};
                }
                resultsSet[item.from].data = response;
                if(++funcscomplete == length){
                    removeWaitingGif();
                    callback(resultsSet);
                }            
            });
        }else if (item.type == "html"){
            widgetHtml(item.from, function(response){
                if(!resultsSet[item.from]){
                    resultsSet[item.from] = {};
                }
                resultsSet[item.from].html = response;
                if(++funcscomplete == length){
                    removeWaitingGif();
                    callback(resultsSet);
                }
            });
            if(++funcscomplete == length){
                removeWaitingGif();
                callback(resultsSet);
            }            
        }else if(item.type == "webservice"){
            var url = item.url;
            var id = item.id;
            var format = item.format;
            webserviceData(url, function(response){
                resultsSet[id] = {};
                resultsSet[id].data = response;
                if(++funcscomplete == length){
                    removeWaitingGif();                    
                    callback(resultsSet);
                }            
            }, item);
        }else{
            resultsSet[item.from] = {};
            if(funcscomplete++ == length){
                removeWaitingGif();
                callback(resultsSet);
            }            
        }
    });    
}


