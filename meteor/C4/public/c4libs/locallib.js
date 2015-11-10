function dothisnow(myvar){
    console.log("this is it");
    return "goo";
}

function getJSONfromWidget(widgnetName){

}

function getHTMLfromWidget(widgetName){

}

function getOutputFromWidget(widgetName){
    var reqUrl = 'http://localhost/jsbin/'+widgetName+'/latest.html'

    var finalresult;
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

    return finalresult;
}