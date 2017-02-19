var c5_widget_cache = {json :{} , html : {}};


function pageId(){
    // get parent url, figure out the "page id"
//    console.log(window.parent.parent.parent.location.href);
    var search= window.parent.parent.location.search;
    var pageid = "";
    try{
        var results = /.*pageid=([^\&]+)/.exec(search);
        if(results){
            pageid = results[1];
        }
        pageid = pageid.replace(/\:script/, "");
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
        if(split.length > 0){
            pageid = split.shift();
        }
        pageid = pageid.replace(/\:script/, "");
    }
    return pageid;
}

function pageid(){
    return pageId();
}

function pageType(){
    // get parent url, figure out the "page id"
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


function widgetId(){
    // .widgetContainer : id
    var container = $(window.parent.parent.frameElement.parentNode).parent();
    var id = $(container).attr("id");
    var split = id.split("_");
    return split.pop();

}

function widgetid(){
    return widgetId();
}

function userId(){
    var container = $(window.parent.parent.frameElement.parentNode).parent();
    var id = $(container).attr("data-userid");
    var split = id.split("_");
    id = split.pop();
    return id;

}

function userid(){
    return userId();
}



function userName(){
    var container = $(window.parent.parent.frameElement.parentNode).parent();
    var id = $(container).attr("data-username");
    var split = id.split("_");
    id = split.pop();
    return id;
}
function username(){
    return userName();
}



function purgeWidgetCache(widgetName, callback){
    if(!widgetName){
        c5_widget_cache = {};
    }
    else{
        delete c5_widget_cache[widgetName];
    }
}

function c4_done(){
    c5_done();
}
function c5_done(){
    console.log("c5_done");
}

function widgetData(widgetName, callback){
    getOutputFromWidget(widgetName, "json", function(result){
        if(!result){
            callback(false);
            return false;
        }
        var newdiv = $("<div>");
        $(newdiv).append(result);
        var datastring = $(".c5_data", newdiv).text().trim();
        if(!datastring){
            datastring = $(".c4_data", newdiv).text().trim();
        }
        var newObj = false;
        try{
            var newObj = JSON.parse(datastring);
        }catch(e){
            console.log("error parsing data");
            console.log(datastring);
            console.log(e);
        }
        callback(newObj);
    });
}

function widgetHtml(widgetName, callback){
    getOutputFromWidget(widgetName, "html", function(result){
        if(!result){
            callback(false);
            return false;
        }
        var newdiv = $("<div>");
        $(newdiv).append(result);
        var c5_html = $(".c5_html", newdiv);
        if(!c5_html){
            c5_html = $(".c4_html", newdiv);
        }
        callback(c5_html);
    });
}

function getOutputFromWidget(widgetName, format, callback){

    if(c5_widget_cache[format][widgetName]){
        callback(c5_widget_cache[format][widgetName]);
        return true;
    }
    var reqUrl = '/headless/'+widgetName+'/'+pageType()+"/"+pageId();
    $.ajax({
        url: reqUrl,
        dataType: 'html',
        success : function(result){
            c5_widget_cache[format][widgetName] = result;
            callback(result);
        },
        error : function (xhr, status, error) {
            console.log("got error");
            console.log(error);
            console.log(status);
            callback({error: true, message : error, status : status});            
        }
    });
    return true;
}


function webserviceData(url, callback, item){

    if(!url.match(/\?/)){
        url += "?";
    }

console.log("item is ");
console.log(item);
    var theurl = "/web_proxy/?url="+encodeURI(url);
    var data = {};
    var headers = {};
    if (item.headers){
        headers = item.headers;
    }
    if(item.authentication_token){
        headers['Authorization'] = 'Token token=' + item.authentication_token;
    }
    data.headers = headers;
    data.url = url;

    console.log("headers are");
    console.log(headers);
    $.ajax({
        method: "POST",
        url: theurl,
        dataType: 'json',
        data: data,
        success : function(result){
            callback(result);
        },
        error : function (xhr, status, error) {
            console.log("webserviceData  got error");
            console.log(error);
            console.log(status);
            callback({error: true, message : error, status : status});            
        }
    });
}


var gifRemoved = false;
function createWaitingGif(){
    var imgtag = $("<div class='waitinggif'><img class='waitinggif' src='/giphy_proxy/waiting'></div>");
    $("body").prepend(imgtag);
}



function removeWaitingGif(){
    gifRemoved = true;
    $(".waitinggif").remove();
}


function elasticsearchInsert(data, callback){
    var url = "/elasticsearch_proxy";
    var doc = data;
    var pageurl = "/";
    if(pageType() != ""){
        pageurl += pageType();
    }
    if(pageId() != ""){
        pageurl += "/" + pageId();
    }
    doc.pagetype = pageType();
    doc.pageid = pageId();
    doc.widgetid = widgetId();
    doc.pageurl = pageurl;
    $.ajax({
        method : "POST",
        data : JSON.stringify(doc),
        dataType : "json",
        contentType: "application/json; charset=utf-8",        
        url : url,
        success : function(result){
//            console.log("got result for elasticsearch call to " + url);
            callback(result, false, false);
        },
        error : function (xhr, status, error) {
            console.log("elascticsearchInsert  got error");
            console.log(error);
            console.log(xhr);
            console.log(status);
            callback(false, error, status);            
        }
    });
}




function elasticsearchRequest(_query, callback){
    var url = "/elasticsearch_proxy?query="+encodeURIComponent(JSON.stringify(_query));

    $.ajax({
        method: "GET",
//        data : JSON.stringify(data),
//        data : data,
        contentType: "application/json; charset=utf-8",        
        url : url,
        success : function(result){
//            console.log("got result for elasticsearchRequest call to " + url);
            callback(result, false, false);
        },
        error : function (xhr, status, error) {
            console.log("elascticsearchInsert  got error");
            console.log(error);
            console.log(xhr);
            console.log(status);
            callback(false, error, status);            
        }
    });
}


function saveC5Data(options, data, callback){

    var id = "_wi_"+widgetId() + "_pt_"+pageType();
    if(options.thisUserOnly){
        id += "_ui_"+userId();
    }else{
    }
    if(typeof options.thisPageIdOnly == "undefined" || options.thisPageIdOnly == true){
        id += "_pi_"+ pageId();
    }else{
    }

    var reqUrl = "/persistence_proxy/"+encodeURIComponent(id);

    data.version = "2";

    $.ajax({
        method : "POST",
        url: reqUrl,
        data: JSON.stringify(data),
        traditional : false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success : function(result){
            callback(result);
        },
        error : function (xhr, status, error) {
            callback({error: true, message : error, status : status});            
        }
    });
}

function getC5Data(options, callback){
    var id = "_wi_"+widgetId() + "_pt_"+pageType();
    if(options.thisUserOnly){
        id += "_ui_"+userId();
    }else{
    }
    if(typeof options.thisPageIdOnly == "undefined" || options.thisPageIdOnly == true){
        id += "_pi_"+ pageId();
    }else{
    }
    var reqUrl = "/persistence_proxy/"+encodeURIComponent(id);

    $.ajax({
        method : "GET",
        url: reqUrl,
        dataType: 'json',
        success : function(result){
            callback(result);
        },
        error : function (xhr, status, error) {
            callback({error: true, message : error, status : status});            
        }
    });

}

function dataIntoJsonView(data){
    try{
        // .widgetContainer : id
        console.log(window.parent.parent.frameElement.parentNode);
        var container = $(window.parent.parent.frameElement.parentNode).parent();
        var editHeader = $(".widgetEditHeader",container);
//    $(".nav",editHeader).css("border", "1px solid black");
// from here, edit the "Data", populate it with the json view thing.
    }catch(e){
        // maybe there isn't a parent. if so, just ignore, move on...
    }
}

function requireWidgetData(requiresList, callback){
    if(!window.location.href.match(/headless=true/)){
        createWaitingGif();
    }
    var length = requiresList.length;
    var funcscomplete = 0;
    var resultsSet = {};
    var forJsonView = {};
    if(length == 0){
        removeWaitingGif();
        callback(resultsSet);
    }
    $.each(requiresList, function(index, item){
        if(item.type == "data"){
            widgetData(item.from, function(response){
                if(!resultsSet[item.from]){
                    resultsSet[item.from] = {};
                    forJsonView[item.from] = {};
                }
                resultsSet[item.from].data = response;
                forJsonView[item.from].data = response;
                console.log("checking if " + funcscomplete + " == " + length);
                if(++funcscomplete == length){
                    console.log("we're done with calls");
                    removeWaitingGif();
                    dataIntoJsonView(forJsonView);
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
                    dataIntoJsonView(forJsonView);
                    callback(resultsSet);
                }
            });
            if(++funcscomplete == length){
                removeWaitingGif();
                dataIntoJsonView(forJsonView);
                callback(resultsSet);
            }            
        }else if(item.type == "webservice"){
            var url = item.url;
            var id = item.id;
            var format = item.format;
            webserviceData(url, function(response){
                resultsSet[id] = {};
                forJsonView[id] = {};
                resultsSet[id].data = response;
                forJsonView[id].data = response;
                if(++funcscomplete == length){
                    removeWaitingGif();
                    dataIntoJsonView(forJsonView);
                    callback(resultsSet);
                }            
            }, item);
        }else{
            resultsSet[item.from] = {};
            if(funcscomplete++ == length){
                removeWaitingGif();
                dataIntoJsonView(forJsonView);
                callback(resultsSet);
            }            
        }
    });    
}


