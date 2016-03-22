pageinfo = setWidgetDefaults = giphy_modal = null;

if (Meteor.isClient) {


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

  setWidgetDefaults = function(doc){
    if(typeof doc.displayWidth === "undefined" || !doc.displayWidth || doc.displayWidth.trim() == "" || doc.displayWidth == "width" || doc.displayWidth == "default"){
      doc.displayWidth = "default";
      doc.displayUsableWidth = "";
    }else{
      doc.displayUsableWidth = doc.displayWidth;
    }
    if(typeof doc.displayHeight === "undefined" || !doc.displayHeight || doc.displayHeight.trim() == "" || doc.displayHeight == "height"  || doc.displayHeight == "default"){
      doc.displayHeight = "default";
      doc.displayUsableHeight = "";
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

    if(!doc.visibility){
      doc.visibility = "public";
    }



    return doc;
  }
}