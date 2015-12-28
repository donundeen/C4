
Widgets = new Mongo.Collection("widgets");

pageinfo = setWidgetDefaults = null;

if (Meteor.isClient) {


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

    console.log("mapping");
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

    return doc;
  }


  Meteor.startup(function(){
   $(window).bind('beforeunload', function() {
    $(".save").trigger("click");
    });
  });
  console.log("starting meteor");

 // Widgets.remove("jow");
  UI.registerHelper('shortIt', function(stringToShorten, maxCharsAmount){
    if(stringToShorten.length > maxCharsAmount){
      return stringToShorten.substring(0, maxCharsAmount) + '...';
    }
    return stringToShorten;
  });

  UI.registerHelper('encodeURIComponent', function(string) {
      return encodeURIComponent(string);
  });

  UI.registerHelper('absoluteUrl', function(){
    return Meteor.absoluteUrl();
  });


  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });


  Template.registerHelper("pageid", function(){  
    return pageinfo().pageid;
  });

  Template.registerHelper("pageurl", function(){  
    return pageinfo().pageurl;
  });
  Template.registerHelper("pagetype", function(){  
    return pageinfo().pagetype;
  });





  function giphy_modal(term, text){
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

  Template.body.helpers({
    widgets: function () {
        // Otherwise, return all of the tasks
        return Widgets.find({pagetype : pageinfo().pagetype}, {sort: {createdAt: -1}}).map(setWidgetDefaults); 
    },
    widgetTemplates: function () {
      // Otherwise, return all of the tasks
      return Widgets.find({isTemplate : true}, {sort: {createdAt: -1}}); 
    }
  });


  Template.body.events({


    "click .lockall": function () {
      console.log("locked" + this._id);
      console.log("locking");

      $(".lock").trigger("click");

      $(".lockall").hide();
      $(".unlockall").show();
      giphy_modal("unlock", "Unlocking all widgets you have access to");


      return false;

    },
    "click .unlockall": function () {
      console.log("unlocking");
      $(".unlock").trigger("click");
      $(".lockall").show();
      $(".unlockall").hide();

      giphy_modal("lock", "Locking all Widgets");

      return false;
    },

    "click .giphy": function(e, t){
      $(e.target).hide();
    },



    'click .copy_from_template' : function(){
      console.log("copy from template "+ this.url);

      var template = Widgets.findOne({url : this.url}); //.map(setWidgetDefaults);
      var dataobj = {html : template.html, css: template.css, javascript: template.javascript};
      var url = "/api/save";//?js="+jsstring+"&html="+htmlstring+"&css="+csstring,
      var options = {data: dataobj};
      
      HTTP.post(url, options, function(error, results){
        console.log("data submitted");
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
                    pagetype : pageinfo().pagetype,
                    pageurl : pageinfo().pageurl,
                    pageid : pageinfo().pageid,
                    url: results.data.url,
                    createdAt: new Date(),
                    rand: Math.random() };
        console.log("creating new widget");
        console.log(newWidget);
        Widgets.insert(newWidget);
      });

      giphy_modal("copy", "New Widget Copied From Template");


      return false;
    },

    'click .deletetemplate' : function(){
      var template = Widgets.findOne({url : this.url}); //.map(setWidgetDefaults);
      template.isTemplate = false;
      Widgets.update(template._id, template);
    },

    'click .addwidget' : function(){
      //add jsbin widget
      console.log("clicked");

      var htmlstring = '<html>\n '+ 
'<head>\n '+
'<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>\n '+
'<script src="http://localhost/c4libs/locallib.js"></script>\n '+
'   <script type="application/json" class="c4_data">{"data" : "data placed here gets passed along"}</script>\n '+
'</head>\n '+
'<body>\n '+
'  <div class="c4_html">\n '+
'  html placed here gets passed along\n '+
'  </div>\n '+
'</body>\n '+
'</html>\n';
      var csstring = "";
      var jsstring = "function doTheThings(data){\n"+
                    "// everything you want to do should happen inside this function\n " +
                    "// the data var will be populated with whatever you've requested from other widgets\n" +
                    "// and this function will be call when all those widgets have complete \n" +
                    "   c4_done(); // this message is required at the end of all the processing, so the system knows this widget is done \n "+ 
                    "} \n" +
                    "requireWidgetData( \n"+
                      "// all requests to other widgets go here (automatically if you use the 'pull from' interface): \n"+
                      "// c4_requires \n"+
                      "{} \n"+
                      "// end_c4_requires \n"+
                      "// end other widget requests \n"+
                      ", doTheThings)";
      var dataobj = {html : htmlstring, css: csstring, javascript: jsstring};
      var url = "/api/save";//?js="+jsstring+"&html="+htmlstring+"&css="+csstring,
      var options = {data: dataobj};
      HTTP.post(url, options, function(error, results){
        console.log("data submitted");
        console.log(results);
        console.log(error);
        console.log(results.data.url);
        newWidget = {_id: results.data.url,
                    createdBy : { username : Meteor.user().username,
                                  userid : Meteor.userId() },          
                    isTemplate : false,
                    name: results.data.url,
                    description : "",
                    html : results.data.html,
                    javascript : results.data.javascript,
                    css: results.data.css,
                    displayWidth: results.data.displayWidth,
                    displayHeight: results.data.displayHeight,
                    widgetStyle : results.data.widgetStyle,
                    pagetype : pageinfo().pagetype,
                    pageurl : pageinfo().pageurl,
                    pageid : pageinfo().pageid,
                    url: results.data.url,
                    createdAt: new Date(),
                    rand: Math.random() };
        Widgets.insert(newWidget);
      });
      return false;
    },

    'click .test' : function(){
      console.log("testing");
      var editors = document.getElementById('jsbin_goq').contentWindow.editors;
      console.log(editors);

      var snippet = "hey there you!";

      addJsCodeAtCursor(snippet, editors);
      return false;
    }
  });


  Template.body.onRendered(function(){
    $(".tooltip-right").tooltip({placement: "right"});
    $("[title]").tooltip({placement: "auto"});
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}