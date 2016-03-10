
Widgets = new Mongo.Collection("widgets");

// set GLOBAL VARS
//In the client side
SERVER_NAME = "localhost";
SERVER_IP = "localhost";

if (Meteor.isClient) {
   Meteor.call('getServerName', function(err, results) {
       SERVER_NAME=results;
   });
   Meteor.call('getServerIP', function(err, results) {
       SERVER_IP=results;
   });
}


if (Meteor.isServer) {

   Meteor.methods({
      getServerName: function(){
	  SERVER_NAME = process.env.SERVER_NAME;
	  if(typeof(SERVER_NAME)==="undefined"){
	      SERVER_NAME = "localhost";
	  }
          return SERVER_NAME;
      },
       getServerIP :  function(){
	   SERVER_IP = process.env.SERVER_IP;
	   if(typeof(SERVER_IP)==="undefined"){
	       SERVER_IP = "localhost";
	   }
	   return SERVER_IP;
       }
   });
}

if (Meteor.isClient) {

  Meteor.startup(function(){
   $(window).bind('beforeunload', function() {
    $(".save").trigger("click");
    });
  });
  console.log("starting meteor");



////// HELPERS
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
  Template.registerHelper("SERVER_NAME",function(){
      return SERVER_NAME;
  });
  Template.registerHelper("SERVER_IP",function(){
      return SERVER_IP;
  });
  Template.body.helpers({
    widgets: function () {
        // Otherwise, return all of the tasks
        var find = {this_page_only: {$in : [false, null]},
                pagetype : pageinfo().pagetype};

        return Widgets.find(find, {sort: {createdAt: -1}}).map(setWidgetDefaults); 
    },
    widgetTemplates: function () {
      // Otherwise, return all of the tasks
      return Widgets.find({isTemplate : true}, {sort: {createdAt: -1}}); 
    },
    libraryWidgets: function () {
      // Otherwise, return all of the tasks
      var find = {inLibrary: true};
      find["createdBy.userid"] = Meteor.userId();
      return Widgets.find(find, {sort: {createdAt: -1}}); 
    },    
    thisPageWidgets: function () {
      // Otherwise, return all of the tasks
      var find = {this_page_only: true,
                pagetype : pageinfo().pagetype,
                pageid : pageinfo().pageid};
      return Widgets.find(find, {sort: {createdAt: -1}}); 
    }    


  });
////// END HELPERS


////// TEMPLATE ONRENDERED
  Template.body.onRendered(function(){
    $(".tooltip-right").tooltip({placement: "right"});
    $("[title]").tooltip({placement: "auto"});
  });
////// END ONRENDERED



/////// EVENTS
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
'<script src="/c4libs/locallib.js"></script>\n '+
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
                    displayWidth: "",
                    displayHeight:  "",
                    widgetStyle :  "",
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
      return false;
    }
  });


///// END EVENTS


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
