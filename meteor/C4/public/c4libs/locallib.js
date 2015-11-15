var c4_widget_cache = {};



function pageId(){
    // get parent url, figure out the "page id"
//    console.log(window.parent.parent.parent.location.href);
    var search= window.parent.parent.location.search;
    var pageid;
    try{
        pageid = /.*pageid=([^\&]+)/.exec(search)[1];
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



function purgeWidgetCache(widgetName){
    if(!widgetName){
        c4_widget_cache = {};
    }
    else{
        delete c4_widget_cache[widgetName];
    }
}

function widgetData(widgetName){
    var result = getOutputFromWidget(widgetName);
    var newdiv = $("<div>");
    $(newdiv).append(result);
    var datastring = $(".c4_data", newdiv).text().trim();
    try{
        var newObj = JSON.parse(datastring);
        return newObj;
    }catch(e){
        console.log("error parsing data");
        console.log(datastring);
        console.log(e);
        return {};
    }
}

function widgetHtml(widgetName){
    var result = getOutputFromWidget(widgetName);
    var newdiv = $("<div>");
    $(newdiv).append(result);
    var c4_html = $(".c4_html", newdiv);
    return c4_html;
}


function getOutputFromWidget(widgetName){

    if(c4_widget_cache[widgetName]){
        return c4_widget_cache[widgetName];
    }
    var reqUrl = 'http://localhost/headless/'+widgetName+'/'+pageType()+"/"+pageId();
    console.log("calling " + reqUrl);
    var finalresult = "{}";
    $.ajax({
        url: reqUrl,
        dataType: 'html',
        async: false,
        success : function(result){
            console.log("got result");
            console.log(result);
            finalresult = result;
        },
        error: function (xhr, status, error) {
            console.log("got error");
            console.error(error);
            console.log(status);
        }
    });

    c4_widget_cache[widgetName] = finalresult;
    return finalresult;
}


function webserviceData(url){
    var finalresult  = {};
    var theurl = "http://localhost/web_proxy/"+url;
    console.log("calling webservice url " + theurl);
    $.ajax({
        url: theurl,
        dataType: 'json',
        async: false,
        success : function(result){
            finalresult = result;
        },
        error: function (xhr, status, error) {
            console.log("got error");
            console.error(error);
            console.log(status);
        }
    });
    return finalresult;
}