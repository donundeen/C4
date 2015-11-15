var c4_widget_cache = {};



function pageId(){
    // get parent url, figure out the "page id"
//    console.log(window.parent.parent.parent.location.href);
    var search= window.parent.parent.location.search;
    var pageid;
    try{
        console.log("searching " + search);
        pageid = /.*pageid=([^\&]+)/.exec(search)[1];
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
        var pageid = split.shift();
        pageid = pageid.replace(/\:script/, "");

        console.log("locallib returning pageid " + pageid);

    }
    return pageid;
}

function pageType(){
    // get parent url, figure out the "page id"
//    console.log(window.parent.parent.parent.location.href);
    var search= window.parent.parent.location.search;
    var pagetype;
    try{
        pagetype = /.*pagetype=([^\&]+)/.exec(search)[1];
    }catch(e){
        var pathname = window.location.pathname;
        var split = pathname.split("/");
        split.shift();
        var next = split.shift();
        if(next == "headless"){
            split.shift();
        }
        var pageurl =  split.join("/");    
        var pagetype = split.shift();
        var pageid = split.shift();
    }
    return pagetype;
}



function purgeWidgetCache(widgetName, callback){
    if(!widgetName){
        c4_widget_cache = {};
    }
    else{
        delete c4_widget_cache[widgetName];
    }
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
    var reqUrl = 'http://localhost/headless/'+widgetName+'/'+pageType()+"/"+pageId();
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


function webserviceData(url, callback){
    var theurl = "http://localhost/web_proxy/"+url;
    console.log("calling webservice url " + theurl);
    $.ajax({
        url: theurl,
        dataType: 'json',
        success : function(result){
            console.log("got result");
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