var c4_widget_cache = {};

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
    var newObj = JSON.parse($(".c4_data", newdiv).text());
    return newObj;

}

function widgetHtml(widgetName){
    console.log("getting html from "+ widgetName);

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

    var reqUrl = 'http://localhost/headless/'+widgetName+'/html'

    console.log("2 getting html from " + reqUrl);

    var finalresult = "{}";
    $.ajax({
        url: reqUrl,
        dataType: 'html',
        async: false,
        success : function(result){
            console.log("success");
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