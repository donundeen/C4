
Widgets = new Mongo.Collection("widgets");

if (Meteor.isClient) {
  console.log("starting meteor");


  Template.body.helpers({
    widgets: function () {
        // Otherwise, return all of the tasks
        return Widgets.find({}, {sort: {createdAt: 1}}); 
    }
  });


  Template.body.events({
    'click .addwidget' : function(){
      //add jsbin widget
      console.log("clicked");
      var htmlstring = "<html>\n<head>\n<script src='js/locallib.js'><\/script>\n</head>\n<body>\n</body>\n</html>";
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
                    url: results.data.url,
                    createdAt: new Date(),
                    rand: Math.random() };
        Widgets.insert(newWidget);
      });
      return false;
    }
  });


  // In the client code, below everything else
  Template.widget.events({
    "click .delete": function () {
      Widgets.remove(this._id);
    }
  });  

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
