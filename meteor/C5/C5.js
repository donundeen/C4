
Widgets = new Mongo.Collection("widgets");
UserXtras = new Mongo.Collection("userxtras");

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
   console.log("starting meteor");
   $(window).bind('beforeunload', function() {
    $(".save").trigger("click");
    });

  });




  /// comments config
  // On the Client
  Comments.ui.config({
     template: 'bootstrap' // or ionic, semantic-ui
  });

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

  Template.registerHelper("pageid_neverblank", function(){  
    return "_pi_"+pageinfo().pageid;
  });

  Template.registerHelper("pageurl_neverblank", function(){  
    return "_pu_"+pageinfo().pageurl;
  });
  Template.registerHelper("pagetype_neverblank", function(){  
    return "_pt_"+pageinfo().pagetype;
  });

  Template.registerHelper("numComments", function(commentId){

    var instance = Template.instance;

    if(!instance.commentCounters){
      instance.commentCounters = {};
    }
    if(!instance.commentCounters[commentId]){
      instance.commentCounters[commentId] = new ReactiveVar();
    }
    Comments.getCount(commentId, function(error, count){
      instance.commentCounters[commentId].set(count);
    });
    return instance.commentCounters[commentId].get();
  });

  Template.registerHelper("commentIcon", function(commentId){

    var instance = Template.instance;

    var noComments = "zmdi-comment";
    var hasComments = "zmdi-comment-alert";

    if(!instance.commentIcons){
      instance.commentIcons = {};
    }
    if(!instance.commentIcons[commentId]){
      instance.commentIcons[commentId] = new ReactiveVar();
    }
    Comments.getCount(commentId, function(error, count){
      if(count > 0){
        console.log(commentId + " has comments");
        instance.commentCounters[commentId].set("zmdi-comment-alert");
      }else{
        console.log(commentId + " no comments");
        instance.commentIcons[commentId].set("zmdi-comment");
      }
    });
    return instance.commentIcons[commentId].get();
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
        var find = {
                this_page_only: {$in : [false, null]},
                pagetype : pageinfo().pagetype,
                $or : [  
                  {visibility : "public"}, 
                  { $and : [
                    {visibility : "private"} , 
                    {"createdBy.userid" : Meteor.userId() }
                  ]},
                  {visibility : null} 
                ]
              };

        return Widgets.find(find, {sort: {sort_order : 1, createdAt: -1}}).map(setWidgetDefaults); 
    },
    widgetTemplates: function () {
      // Otherwise, return all of the tasks
      return Widgets.find({isTemplate : true}, {sort: {createdAt: -1}}).map(setWidgetDefaults);
    },
    libraryWidgets: function () {
      // Otherwise, return all of the tasks
      var find = {inLibrary: true};
      find["createdBy.userid"] = Meteor.userId();
      return Widgets.find(find, {sort: {createdAt: -1}}).map(setWidgetDefaults);
    },    
    thisPageWidgets: function () {
      // Otherwise, return all of the tasks
      var find = {this_page_only: true,
                pagetype : pageinfo().pagetype,
                pageid : pageinfo().pageid};
      return Widgets.find(find, {sort: {sort_order : 1, createdAt: -1}}).map(setWidgetDefaults);
    },

    userXtras : function(){
      return getUserXtras();
    },

    godmode : function(){
      return getUserXtras().godmode;

    }

  });
////// END HELPERS


////// TEMPLATE ONRENDERED
  Template.body.onRendered(function(){
    //$(".tooltip-right").tooltip({placement: "right"});
  //  $("[title]").tooltip({placement: "auto"});
  });
////// END ONRENDERED



/////// EVENTS
  Template.body.events({


    "click .lockall": function () {
      $(".lock").trigger("click");
      $(".lockall").hide();
      $(".unlockall").show();
      giphy_modal("unlock", "Unlocking all widgets you have access to");
      return false;

    },
    "click .unlockall": function () {
      $(".unlock").trigger("click");
      $(".lockall").show();
      $(".unlockall").hide();
      giphy_modal("lock", "Locking all Widgets");
      return false;
    },

    "click .giphy": function(e, t){
      $(e.target).hide();
    },

    "click .godmode_check" : function(e, t){
      console.log("clicked");
      console.log(e.target.checked);
//      console.log(t); 
console.log("updating  " + Meteor.userId() + " to " + e.target.checked);
      UserXtras.update({_id : Meteor.userId() }, {$set : {godmode : e.target.checked}});

    },

    'click .copy_from_template' : function(){
      copyWidgetToPage($(this).attr("target"), pageinfo().pagetype, pageinfo().pageurl, pageinfo().pageid);
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

      var htmlstring = '<html>\n '+ 
'<head>\n '+
'<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>\n '+
'<script src="/c5libs/locallib.js"></script>\n '+
'   <script type="application/json" class="c5_data">{"data" : "data placed here gets passed along"}</script>\n '+
'</head>\n '+
'<body>\n '+
'  <div class="c5_html">\n '+
'  html placed here gets passed along\n '+
'  </div>\n '+
'</body>\n '+
'</html>\n';
      var csstring = "";
      var jsstring = "function doTheThings(data){\n"+
                    "// everything you want to do should happen inside this function\n " +
                    "// the data var will be populated with whatever you've requested from other widgets\n" +
                    "// and this function will be call when all those widgets have complete \n" +
                    "   c5_done(); // this message is required at the end of all the processing, so the system knows this widget is done \n "+ 
                    "} \n" +
                    "requireWidgetData( \n"+
                      "// all requests to other widgets go here (automatically if you use the 'pull from' interface): \n"+
                      "// c5_requires \n"+
                      "{} \n"+
                      "// end_c5_requires \n"+
                      "// end other widget requests \n"+
                      ", doTheThings)";
      var dataobj = {html : htmlstring, css: csstring, javascript: jsstring};
      var url = "/api/save";//?js="+jsstring+"&html="+htmlstring+"&css="+csstring,
      var options = {data: dataobj};
      HTTP.post(url, options, function(error, results){
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
                    visibility: "private",
                    createdAt: new Date(),
                    rand: Math.random() };
        Widgets.insert(newWidget);
      });
      return false;
    },

    'click .test' : function(){
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
