
Widgets = new Mongo.Collection("widgets");

if (Meteor.isClient) {

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


  var pageinfo = function(){
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
    },
    widgetTemplates: function () {
      // Otherwise, return all of the tasks
      console.log(Widgets.find({isTemplate : true}, {sort: {createdAt: -1}}));
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

      return false;

    },
    "click .unlockall": function () {
      console.log("unlocking");
      $(".unlock").trigger("click");
      $(".lockall").show();
      $(".unlockall").hide();

      return false;
    },

 


    'click .copy_from_template' : function(){
      console.log("copy from template "+ this.url);

      var template = Widgets.findOne({url : this.url});
      var dataobj = {html : template.html, css: template.css, javascript: template.javascript};
      var url = "/api/save";//?js="+jsstring+"&html="+htmlstring+"&css="+csstring,
      var options = {data: dataobj};
      
      HTTP.post(url, options, function(error, results){
        console.log("data submitted");
        newWidget = {_id: results.data.url,
                    isTemplate : false,
                    html : results.data.html,
                    javascript : results.data.javascript,
                    css: results.data.css,
                    description: "(copied from " + template.name +") " + template.description,
                    name : "copy of " + template.name,
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

    'click .deletetemplate' : function(){
      var template = Widgets.findOne({url : this.url});
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
                    isTemplate : false,
                    name: results.data.url,
                    description : "",
                    html : results.data.html,
                    javascript : results.data.javascript,
                    css: results.data.css,
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








  // In the client code, below everything else
  Template.widget.onRendered(function(){

    $("[title]").tooltip({placement: "auto"});
    var thisid = this.data._id;
    var element = document.getElementById('jsbin_'+this.data._id);
    var thiselement = document.getElementById('widgetContainer_'+thisid);

    $(".editmodeonly", thiselement).hide();
    $(thiselement).css("width","");
    $(".widgetDescription").mouseover(function(evt, target){
      $(".widgetDescriptionShort", thiselement).hide();
      $(".widgetDescriptionEdit", thiselement).show();
    });
    $(".widgetDescription").mouseout(function(evt, target){
      $(".widgetDescriptionShort", thiselement).show();
      $(".widgetDescriptionEdit", thiselement).hide();
    });
    $(".widgetDescriptionEdit", thiselement).hide();

    document.addEventListener("DOMNodeInserted", function(evt, item){
      if($(evt.target)[0].tagName == "IFRAME"){
        $((evt.target)).load(function(){
          var thiselement = document.getElementById('widgetContainer_'+thisid);

          var editors = document.getElementById('jsbin_'+thisid).contentWindow.editors;
          var jsbin = document.getElementById('jsbin_'+thisid).contentWindow.jsbin;

          if(jsbin.panels){
            jsbin.panels.saveOnExit = true;
          }
          var el = $(editors.live.el)[0];
/*
          setTimeout(function(){
            $("#runwithalerts", el).trigger("click");
          }, 1000); 
*/
          var menu = document.getElementById('jsbin_'+thisid).contentWindow.document.getElementById("control");
          var bin = document.getElementById('jsbin_'+thisid).contentWindow.document.getElementById("bin");
          var newbintop = 0;
          this.maxed = true;
          if(this.maxed){
            $(menu).hide();
            $(".editmodeonly", thiselement).hide();
            this.oldbintop = $(bin).css("top");
            $(bin).css("top", newbintop);
          }else{
            console.log("showing");
            $(".editmodeonly", thiselement).hide();            
            $(menu).show();
            $(bin).css("top", this.oldbintop);
          }
        });
      }
    });
 }); 

  Template.widget.events({
    "click .delete": function () {
      if(this.isTemplate){
        this.pagetype = "template";
        Widgets.update(this._id, this);
      }else{
        Widgets.remove(this._id);
      }
      return false;
    },

    "click .save": function () {
      var editors = document.getElementById('jsbin_'+this._id).contentWindow.editors;
      var jsbin = document.getElementById('jsbin_'+this._id).contentWindow.jsbin;
      var revision = jsbin.state.revision;
 
      this.html = editors.html.getCode();
      this.javascript = editors.javascript.getCode();
      this.css = editors.css.getCode();
      jsbin.saveDisabled = false;
      jsbin.panels.save();
      jsbin.panels.savecontent();
      Widgets.update(this._id, this);

      // also trigger the jsbin save
      var dataobj = {html : this.html, css: this.css, javascript: this.javascript};
      var url = "/api/"+this.url+"/save";//?js="+jsstring+"&html="+htmlstring+"&css="+csstring,
      var options = {data: dataobj};
      HTTP.post(url, options, function(error, results){
      });


      return false;
    },

    "click .add_code" : function(evt, template){

      var pullfrom = evt.currentTarget.dataset.pullfrom;
      var pulltype = evt.currentTarget.dataset.pulltype;

      if(this.url == template.data.url){
        return false;
      }

      var type;
      var comments = "";
      if(pulltype == "data"){
        type = "data";
        comments = " This will hold a JSON object";
      }
      if(pulltype == "html"){
        type = "html";
        comments = " This will hold a jQuery object";
      }
      var codeString = "{from: '"+pullfrom+"', type : '"+pulltype+"'}";
      var codeStringRe = "\\{from: '"+pullfrom+"', type : '"+pulltype+"'\\}";
      var editors = document.getElementById('jsbin_'+template.data.url).contentWindow.editors;
      var code = editors.javascript.getCode();
      var line = editors.javascript.editor.getCursor().line;
      var charpos = editors.javascript.editor.getCursor().ch;
      // make sure it's not already in there:
      var codeRe = new RegExp("\/\/ *c4_requires[\\s\\S]*\\[[\\s\\S]*"+codeStringRe+"[\\s\\S]*\\] *,[\\s\\S]*\/\/ *end_c4_requires");
      console.log(codeRe);
      var codeMatch = code.match(codeRe);
      if(!codeMatch){
        console.log(" no match, replacing");
        // match to empty array
        var match = /(\/\/ *c4_requires[\s\S]*\[)\s*(\] *,[\s\S]*\/\/ *end_c4_requires)/;
        var results = code.match(match);
        console.log(results);
        newcode = code.replace(match, "$1\n"+codeString+" // "+comments+"\n$2")

        if(newcode == code){
          // match to non-empty array
          var match = /(\/\/ *c4_requires[\s\S]*\[)([^\]]*\] *,[\s\S]*\/\/ *end_c4_requires)/;
          var results = code.match(match);
          console.log(results);

          newcode = code.replace(match, "$1\n"+codeString+", // " + comments + "$2");
        }
        code = newcode;
        var state = { line: editors.javascript.editor.currentLine(),
            character: editors.javascript.editor.getCursor().ch,
            add: 0
          };

        editors.javascript.setCode(code);
        editors.javascript.editor.setCursor({ line: state.line + state.add, ch: state.character });
      }
      return false;
    },



    "click .test": function () {
      console.log("testing widget thing");
      var thiselement = document.getElementById('widgetContainer_'+this._id);
      var editors = document.getElementById('jsbin_'+this._id).contentWindow.editors;
      var jsbin = document.getElementById('jsbin_'+this._id).contentWindow.jsbin;
      var menu = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("control");
      var bin = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("bin");
      console.log(editors);
      console.log(jsbin);

      console.log(thiselement);

      var newbintop = 0;
      this.maxed = !this.maxed;
      if(this.maxed){
        $(menu).hide();
        $(".editmodeonly", thiselement).hide();
        this.oldbintop = $(bin).css("top");
        $(bin).css("top", newbintop);
      }else{
        $(menu).show();
        $(".editmodeonly", thiselement).show();
        $(bin).css("top", this.oldbintop);
      }
      return false;
    },
    /*
    panel ids: html, css, javascript, console, live
    */
    "click .lock": function () {
      console.log("locked" + this._id);
      var thiselement = document.getElementById('widgetContainer_'+this._id);

      var editors = document.getElementById('jsbin_'+this._id).contentWindow.editors;
      var jsbin = document.getElementById('jsbin_'+this._id).contentWindow.jsbin;
      jsbin.panels.show("html");
      jsbin.panels.show("javascript");
      $(".lock").hide();
      $(".unlock").show();
//      editors.panels.show("css");
      var menu = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("control");
      var bin = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("bin");
      console.log(editors);
      console.log(jsbin);

      var newbintop = 0;
      this.maxed = false;
      if(this.maxed){
        $(menu).hide();
        $(".editmodeonly", thiselement).hide();
        this.oldbintop = $(bin).css("top");
        $(bin).css("top", newbintop);
        $(thiselement).css("width","");

      }else{
        $(menu).show();
        $(".editmodeonly", thiselement).show();
        $(bin).css("top", this.oldbintop);
        $(thiselement).css("width","100%");
      }



      return false;

    },
    "click .unlock": function () {
      var thiselement = document.getElementById('widgetContainer_'+this._id);

      console.log("unlocked" + this._id);
      var editors = document.getElementById('jsbin_'+this._id).contentWindow.editors;
      var jsbin = document.getElementById('jsbin_'+this._id).contentWindow.jsbin;
      jsbin.panels.hide("html");
      jsbin.panels.hide("javascript");
      jsbin.panels.hide("css");
      jsbin.panels.hide("console");
      $(".lock").show();
      $(".unlock").hide();

      var menu = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("control");
      var bin = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("bin");
      console.log(editors);
      console.log(jsbin);

      var newbintop = 0;
      this.maxed = true;
      if(this.maxed){
        $(menu).hide();
        console.log($(".editmodeonly"));
        $(".editmodeonly", thiselement).hide();
        this.oldbintop = $(bin).css("top");
        $(bin).css("top", newbintop);
        $(thiselement).css("width","");
      }else{
        $(menu).show();
        $(".editmodeonly", thiselement).show();
        $(bin).css("top", this.oldbintop);
        $(thiselement).css("width","100%");
        $(thiselement).css("height","100%");
      }


      return false;
    },


    "click .save_template": function () {
      console.log("saving as a template " + this._id);
      this.isTemplate = !this.isTemplate;
      console.log(this.isTemplate);
      Widgets.update(this._id, this);

      var editors = document.getElementById('jsbin_'+this._id).contentWindow.editors;
      var jsbin = document.getElementById('jsbin_'+this._id).contentWindow.jsbin;
      return false;
    }


  });  

  Template.widget.helpers({
    otherwidgets: function () {
        // Otherwise, return all of the tasks
        return Widgets.find({pagetype : pageinfo().pagetype, _id : {$ne : this._id}}, {sort: {createdAt: -1}}); 
    }
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
