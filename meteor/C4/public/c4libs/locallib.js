function dothisnow(myvar){
    console.log("this is it");
    return "goo";
}

function getJSONfromWidget(widgnetName){

}

function getHTMLfromWidget(widgetName){
    console.log("getting html form "+ widgetName);

    var result = getOutputFromWidget(widgetName);

    console.log(result);

    return result.html;
}

function getOutputFromWidget(widgetName){
    var reqUrl = 'http://localhost/api/'+widgetName+'/latest'

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

    return JSON.parse(finalresult);
}