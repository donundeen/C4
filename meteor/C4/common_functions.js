pageinfo = setWidgetDefaults = giphy_modal = getUserXtras = null;

if (Meteor.isClient) {

  getUserXtras = function(){
    var userxtras = false;
    var user = Meteor.user();
    if(user){
      console.log(user.username);
      console.log(user._id);
      console.log("getting for " + user._id);
      var userxtras = UserXtras.findOne({_id : user._id });
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
      console.log(userxtras);
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



    return doc;
  }
}