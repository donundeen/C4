
if (Meteor.isClient) {


  function setDisplayModeOn(widgetData, iframeElement, widgetElement, menu, bin, jsbin){
    var newbintop = 0;
    $(menu).hide();
    $(".editmodeonly", widgetElement).hide();
    $(".displaymodeonly", widgetElement).show();
    iframeElement.oldbintop = $(bin).css("top");
    $(bin).css("top", newbintop);
    $(widgetElement).attr("style", widgetData.usableWidgetStyle);
    $(widgetElement).css("width", widgetData.displayUsableWidth);
    $(widgetElement).css("height", widgetData.displayUsableHeight);
    $(".widgetDisplayHeader", widgetElement).hide();  

    if(jsbin && jsbin.panels){
      jsbin.panels.hide("html");
      jsbin.panels.hide("javascript");
      jsbin.panels.hide("css");
      jsbin.panels.hide("console");
    }
    $(".lock", widgetElement).show();
    $(".unlock", widgetElement).hide();
    $(widgetElement).data("mode", "display");

  }

  function setEditModeOn(widgetData, iframeElement, widgetElement, menu, bin, jsbin){

    if(jsbin){
      jsbin.panels.show("html");
      jsbin.panels.show("javascript");
    }
    $(".lock", widgetElement).hide();
    $(".unlock", widgetElement).show();
//      editors.panels.show("css");

    var newbintop = 0;

    // put it in EDIT MODE
    $(menu).show();
    $(".editmodeonly", widgetElement).show();
    $(".displaymodeonly", widgetElement).hide();
    $(bin).css("top", iframeElement.oldbintop);
    $(widgetElement).css("width","100%");
    $(widgetElement).css("height","100%");

  }



  // In the client code, below everything else
  Template.widget.onRendered(function(){

    (function(widget){
      $("[title]").tooltip({placement: "auto"});
      var thisid = widget.data._id;
      var element = document.getElementById('jsbin_'+thisid);
      var thiselement = document.getElementById('widgetContainer_'+thisid);
      $(".widgetDisplayHeader", thiselement).hide();  

      // maybe already exists?
      var theElement = document.getElementById('jsbin_'+thisid);
      if(theElement && theElement.contentWindow && theElement.contentWindow.document){
        $(theElement).load(function(){
          var widgetElement = document.getElementById('widgetContainer_'+thisid);
          var editors = jsbin = menu = bin = null;
          if(theElement){
            console.log("found element for jsbin_"+thisid);
            editors = theElement.contentWindow.editors;
            jsbin = theElement.contentWindow.jsbin;
            menu = theElement.contentWindow.document.getElementById("control");
            bin = theElement.contentWindow.document.getElementById("bin");   
            var thiselement = document.getElementById('widgetContainer_'+thisid);
            if(jsbin && jsbin.panels){
              jsbin.panels.saveOnExit = true;
            }            
            setDisplayModeOn(widget.data, this, widgetElement, menu, bin, jsbin);
          }else{
            console.log("no element found for jsbin_"+thisid);
          }
        });
      }
      // this part here happens when the JSBIN stuff is loaded.
      document.addEventListener("DOMNodeInserted", function(evt, item){
        if($(evt.target)[0].tagName == "IFRAME"){
          $((evt.target)).load(function(){
            console.log("target load " + thisid);
            var widgetElement = document.getElementById('widgetContainer_'+thisid);
            var editors = jsbin = menu = bin = null;
            var theElement = document.getElementById('jsbin_'+thisid);
            if(theElement){
              editors = theElement.contentWindow.editors;
              jsbin = theElement.contentWindow.jsbin;
              menu = theElement.contentWindow.document.getElementById("control");
              bin = theElement.contentWindow.document.getElementById("bin");              
            }else{
              console.log("no element found for jsbin_"+thisid);
            }
            if(jsbin && jsbin.panels){
              jsbin.panels.saveOnExit = true;
            }
            setDisplayModeOn(widget.data, this, widgetElement, menu, bin, jsbin);
          });
        }
      });
    })(this);
 }); 


  Template.help.events({
    "click .giphy": function(e, t){
      $(e.target).hide();
    }
  });

  Template.widget.events({

    "click .giphy": function(e, t){
      $(e.target).hide();
    },

    "click .delete": function () {
      if(this.isTemplate){
        this.pagetype = "template";
        Widgets.update(this._id, this);
      }else{
        Widgets.remove(this._id);
      }

      giphy_modal("erase", "Widget Deleted");

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

      giphy_modal("saved", "Widget Content Saved");

      return false;
    },

    "click .call_webservice_url" : function(evt, template){
      console.log("calling webservice url");
      /* need to insert something like:
{
    id : "vasearch",
    type :"webservice", 
    url : "http://www.vam.ac.uk/api/json/museumobject/search?q="+pageid()}

      */
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

      if(!editors){
        return true;
      }
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
      return true;
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

    // this sets it to EDIT mode
    "click .lock": function () {

      var widgetElement = document.getElementById('widgetContainer_'+this._id);
      var iframeElement = document.getElementById('jsbin_'+this._id)

      var editors = iframeElement.contentWindow.editors;
      var jsbin = iframeElement.contentWindow.jsbin;
      var menu = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("control");
      var bin = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("bin");

      setEditModeOn(this, iframeElement, widgetElement, menu, bin, jsbin);


      return false;

    },


    // this sets it to DISPLAY mode
    "click .unlock": function () {

      var widgetElement = document.getElementById('widgetContainer_'+this._id);
      var iframeElement = document.getElementById('jsbin_'+this._id)

      var editors = iframeElement.contentWindow.editors;
      var jsbin = iframeElement.contentWindow.jsbin;
      var menu = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("control");
      var bin = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("bin");
      setDisplayModeOn(this, iframeElement, widgetElement, menu, bin, jsbin);

      return false;
    },


    'click .copy' : function(){
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
        Widgets.insert(newWidget);
      });

      giphy_modal("copy", "widget copied");

      console.log("copied");
      return false;
    },    


    "click .save_template": function () {
      this.isTemplate = !this.isTemplate;
      Widgets.update(this._id, this);
      var editors = document.getElementById('jsbin_'+this._id).contentWindow.editors;
      var jsbin = document.getElementById('jsbin_'+this._id).contentWindow.jsbin;

      giphy_modal("promotion", "widget saved as a template");

      return false;
    },


    "mouseenter .widgetMouseOverTarget" : function(){
      console.log("mouseover");
        var thiselement = document.getElementById('widgetContainer_'+this._id);
        var mode = $(thiselement).data("mode");
        if(!mode || mode == "display"){
    //      $(".widgetMouseOverTarget", thiselement ).css("background", "red");
          $(".widgetDisplayHeader", thiselement).show();
          $(".widgetMouseOverTarget", thiselement ).css("z-index", 5);
          $(".widgetDisplayHeader", thiselement ).css("z-index", 10);
        }
    },

    "mouseleave .widgetDisplayHeader" : function(){
      var thiselement = document.getElementById('widgetContainer_'+this._id);
      $(".widgetMouseOverTarget", thiselement ).css("background", "transparent");
      $(".widgetDisplayHeader", thiselement).hide();      
      $(".widgetMouseOverTarget", thiselement ).css("z-index", 10);
      $(".widgetDisplayHeader", thiselement ).css("z-index", 5);
    }


  });  

  Template.widget.helpers({
    otherwidgets: function () {
        // Otherwise, return all of the tasks
        return Widgets.find({pagetype : pageinfo().pagetype, _id : {$ne : this._id}}, {sort: {createdAt: -1}}).map(setWidgetDefaults); 
    },

    isMyWidget : function (){
      // is this a widget I created?
      if(this.createdBy && Meteor.user()){
        return this.createdBy.username = Meteor.user().username;
      }else{
        return false;
      }
    }
  });
}