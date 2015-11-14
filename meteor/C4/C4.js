
Widgets = new Mongo.Collection("widgets");

if (Meteor.isClient) {
  console.log("starting meteor");


  var pageinfo = function(){
    var pathname = window.location.pathname;
    var split = pathname.split("/");
    split.shift();
    var pageurl =  split.join("/");    

    var pagetype = split.shift();
    var pageid = split.shift();
    return {pageurl : pageurl,
            pagetype : pagetype,
            pageid : pageid};

  }

  Template.registerHelper("pageid", function(){  
    return pageinfo().pageid;
  });

  Template.registerHelper("pageurl", function(){  
    return pageinfo().pageurl;
  });
  Template.registerHelper("pagetype", function(){  
    return pageinfo().pagetype;
  });


  Template.body.helpers({
    widgets: function () {
        // Otherwise, return all of the tasks
        return Widgets.find({pagetype : pageinfo().pagetype}, {sort: {createdAt: -1}}); 
    }
  });


  Template.body.events({
    'click .addwidget' : function(){
      //add jsbin widget
      console.log("clicked");

      var htmlstring = '<html>\n '+ 
'<head>\n '+
'<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>\n '+
'<script src="http://localhost/c4libs/locallib.js"></script>\n '+
'   <script type="javascript" class="c4_data">{"data" : "data placed here gets passed along"}</script>\n '+
'</head>\n '+
'<body>\n '+
'  <div class="c4_html">\n '+
'  html placed here gets passed along\n '+
'  </div>\n '+
'</body>\n '+
'</html>\n';
      var csstring = "";
      var jsstring = "";
      var dataobj = {html : htmlstring, css: csstring, js: jsstring};
      var url = "/api/save";//?js="+jsstring+"&html="+htmlstring+"&css="+csstring,
      var options = {data: dataobj};
      HTTP.post(url, options, function(error, results){
        console.log("data submitted");
        console.log(results);
        console.log(error);
        console.log(results.data.url);
        newWidget = {_id: results.data.url,
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

    }
  });




  // In the client code, below everything else
  Template.widget.events({
    "click .delete": function () {
      Widgets.remove(this._id);
    },

    /*
    panel ids: html, css, javascript, console, live
    */
    "click .lock": function () {
      console.log("locked" + this._id);
      var editors = document.getElementById('jsbin_'+this._id).contentWindow.editors;
      var jsbin = document.getElementById('jsbin_'+this._id).contentWindow.jsbin;
      console.log(editors);
      console.log(jsbin);
      jsbin.panels.show("html");
      jsbin.panels.show("javascript");
      $(".lock").hide();
      $(".unlock").show();
//      editors.panels.show("css");
    },
    "click .unlock": function () {
      console.log("unlocked" + this._id);
      var editors = document.getElementById('jsbin_'+this._id).contentWindow.editors;
      var jsbin = document.getElementById('jsbin_'+this._id).contentWindow.jsbin;
      console.log(editors);
      console.log(jsbin);
      jsbin.panels.hide("html");
      jsbin.panels.hide("javascript");
      jsbin.panels.hide("css");
      jsbin.panels.hide("console");
      $(".lock").show();
      $(".unlock").hide();
    }
  });  

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
