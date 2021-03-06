justaddedid = pageinfo = setWidgetDefaults = giphy_modal = getUserXtras = null;

if (Meteor.isClient) {

  getUserXtras = function(){
    var userxtras = false;
    var user = Meteor.user();
    if(user){
      /*
      console.log(user.username);
      console.log(user._id);
      console.log("getting for " + user._id);
      */
      userxtras = UserXtras.findOne({_id : user._id });
      if(!userxtras || !userxtras.foo){
        console.log("userxtras " + userxtras);
        userxtras = {_id : user._id, admin : false, godmode : false, foo : "var"};
        if(user.username == "donundeen"){
          userxtras.admin = true;
        }
        console.log("saving for " + user._id);
        UserXtras.upsert({_id : user._id}, userxtras);
        var userxtras2 = UserXtras.findOne({_id : user._id });
      }
    }
    return userxtras;

  }



  giphy_modal = function(term, text){
      $("#giphy_modal").modal('show');
      $(".giphy_modal_header").text(text);
      var url = "/giphy_proxy/"+encodeURIComponent(term);
      $(".giphy_modal_image_div").empty();
      var imgurl = url+"?" + new Date().getTime();
      $(".giphy_modal_image_div").html("<img src='"+imgurl+"' width='200' class='giphy_modal_image_img'/>");
      
      setTimeout(function(){
        $("#giphy_modal").modal('hide');
      }, 2000);

  }

  pageinfo = function(){
    var pagetype = "";
    var pageid = "";
    var pathname = window.location.pathname;
    var split = pathname.split("/");
    split.shift();
    var pageurl =  split.join("/");    

    if(split.length > 0){
      pagetype = split.shift();
    }
    if(split.length > 0){
      pageid = split.shift();
    }
    pageid = pageid.replace(/:script/, "");
    return {pageurl : pageurl,
            pagetype : pagetype,
            pageid : pageid};

  }


  copyWidgetToPage = function(origID, pagetype, pageid, pageurl){
    console.log("calling CopyWidgetToPage for " +origID)
      var template = Widgets.findOne({url : origID}); //.map(setWidgetDefaults);
      var dataobj = {html : template.html, css: template.css, javascript: template.javascript};
      var url = "/api/save";//?js="+jsstring+"&html="+htmlstring+"&css="+csstring,
      var options = {data: dataobj};
      
      HTTP.post(url, options, function(error, results){
        newWidget = {_id: results.data.url,
                    createdBy : { username : Meteor.user().username,
                    userid : Meteor.userId() },
                    isTemplate : false,
                    html : results.data.html,
                    javascript : results.data.javascript,
                    css: results.data.css,
                    displayWidth: results.data.displayWidth,
                    displayHeight: results.data.displayHeight,
                    description: "(copied from " + template.name +") " + template.description,
                    widgetStyle : results.data.widgetStyle,
                    name : "copy of " + template.name,
                    pagetype : pagetype,
                    pageurl : pageurl,
                    pageid : pageid,
                    url: results.data.url,
                    createdAt: new Date(),
                    visibility: "private",
                    rand: Math.random() };
        justaddedid = Widgets.insert(newWidget);
        console.log("setting justaddedid " + justaddedid);

        var grid = $(".grid-stack").data('gridstack');
        var widgetElement = $("#widgetContainer_"+results.data.url);

        console.log("added ");
        console.log(widgetElement);
        /*
        var griditem = $(widgetElement).parent().parent();       
        $(griditem).data("gs-width", "12");
        $(griditem).data("gs-height", "5");
        $(griditem).data("gs-auto-position", "true");
        grid.makeWidget(griditem);  
        grid.resize(griditem, 12, 5);

        var next = $(".grid-stack-item").get(0)  ;
        console.log("moving next" + $(next).data("widget-id"));
        console.log(next);
        grid.move(next, 0, 6);
        */
      });
      giphy_modal("copy", "New Widget Copied From Template");

  }


  setWidgetDefaults = function(doc){
    if(typeof doc.displayWidth === "undefined" || !doc.displayWidth || doc.displayWidth.trim() == "" || doc.displayWidth == "width" || doc.displayWidth == "default"){
      doc.displayWidth = "320px";
      doc.displayUsableWidth = "320px";
    }else{
      doc.displayUsableWidth = doc.displayWidth;
    }
    if(typeof doc.displayHeight === "undefined" || !doc.displayHeight || doc.displayHeight.trim() == "" || doc.displayHeight == "height"  || doc.displayHeight == "default"){
      doc.displayHeight = "400px";
      doc.displayUsableHeight = "400px";
    }else{
      doc.displayUsableHeight = doc.displayHeight;
    }
    if(typeof doc.widgetStyle === "undefined" || !doc.widgetStyle || doc.widgetStyle.trim() == "" || doc.widgetStyle == "css" || doc.widgetStyle == "default"){
      doc.widgetStyle = "default";
      doc.usableWidgetStyle = "";
    }else{
      doc.usableWidgetStyle = doc.widgetStyle;
    }
    if(!doc.createdBy){
      doc.createdBy = {};
    }

    if(doc.displayUsableHeight.match(/px/)){
      var height = doc.displayUsableHeight.replace(/px/,"");
      doc.jsbinHeight = height - 20;
      doc.jsbinHeight += "px";
    }else{
      doc.jsbinHeight = "";
    }

    if(!doc.this_page_only){
      doc.this_page_only = false;
    }

    if(!doc.sort_order){
      doc.sort_order = 0;
    }

    if(!doc.visibility){
      doc.visibility = "public";
    }

    if(!doc.cacheConfig){
      doc.cacheConfig = {};
    }

    if(!doc.cacheConfig.ttl){
      doc.cacheConfig.ttl = 60;
    }

    if(typeof doc.width_in_cells == "undefined"){
      doc.width_in_cells = 12;
    }
    if(typeof doc.height_in_cells == "undefined"){
      doc.height_in_cells = 5;
    }
    if(doc.width_in_cells == 0){
      doc.width_in_cells = 1;
    }
    if(doc.height_in_cells == 0){
      doc.height_in_cells = 1;
    }
    if(typeof doc.width_in_px == "undefined"){
      doc.width_in_px = 640;
    }
    if(typeof doc.height_in_px == "undefined"){
      doc.height_in_px = 320;
    }
    if(doc.width_in_px == 0){
      doc.width_in_px = 640;
    }
    if(doc.height_in_px == 0){
      doc.height_in_px = 320;
    }


    return doc;
  }
}