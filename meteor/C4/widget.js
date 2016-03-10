
if (Meteor.isClient) {

/////// FUNCTION DEFS
  var dix = 0;
  function setDisplayModeOn(widgetData, iframeElement, widgetElement, menu, bin, jsbin, widgetid){

    dix++;
    var di = dix;
    var newbintop = 0;
    $(menu).hide();

    if(widgetData.displayUsableWidth.trim() == ""){
      widgetData.displayUsableWidth = "50%";
    }

    $(".editmodeonly", widgetElement).hide();
    $(".displaymodeonly", widgetElement).show();
    iframeElement.oldbintop = $(bin).css("top");
    $(bin).css("top", newbintop);
    $(widgetElement).attr("style", widgetData.usableWidgetStyle);
    $(widgetElement).css("width", widgetData.displayUsableWidth);
    $(widgetElement).css("height", widgetData.displayUsableHeight);
    $(widgetElement).css("border-radius", "20px");
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

    $(iframeElement).css("max-height", "");
    $(iframeElement).css("max-width", "");
    $(iframeElement).width($(widgetElement).width());
    $(iframeElement).height($(widgetElement).height());
    $(iframeElement).css("border-radius", "20px");

    (function(wn, wd, ifr){
      $(wn).resize(function(){
        console.log("resizing");
        $(ifr).width($(wd).width());
        $(ifr).height($(wd).height());
      });
    })(window, widgetElement, iframeElement);

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
    $(widgetElement).css("width",$(window).width());
    $(widgetElement).css("height",$(window).height());
    $(widgetElement).css("border-radius", "20px");

    $(iframeElement).css("max-height", "");
    $(iframeElement).width($(widgetElement).width());
    $(iframeElement).height($(widgetElement).height() - 80);
    $(iframeElement).css("border-radius", "20px");

  }
/////// END FUNCTION DEFS



/////// WIDGET ONRENDERED
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
            console.log("$?$?$?$?$?$??$?$?$?$$?$??$$");
            setDisplayModeOn(widget.data, this, widgetElement, menu, bin, jsbin, thisid);
          }else{
            console.log("no element found for jsbin_"+thisid);
          }
        });
      }
      // this part here happens when the JSBIN stuff is loaded.
      (function(this_id){
        document.addEventListener("DOMNodeInserted", function(evt, item){
          (function(_evt, _this_id){
            if($(_evt.target)[0].tagName == "IFRAME" && $(_evt.target)[0].id.replace("jsbin_","") == _this_id){
              console.log($(_evt.target)[0].id);
              $((_evt.target)).load(function(){
                var widgetElement = document.getElementById('widgetContainer_'+_this_id);
                var editors = jsbin = menu = bin = null;
                var theElement = document.getElementById('jsbin_'+_this_id);
                if(theElement){
                  editors = theElement.contentWindow.editors;
                  jsbin = theElement.contentWindow.jsbin;
                  menu = theElement.contentWindow.document.getElementById("control");
                  bin = theElement.contentWindow.document.getElementById("bin");
                }else{
                  console.log("no element found for jsbin_"+_this_id);
                }
                if(jsbin && jsbin.panels){
                  jsbin.panels.saveOnExit = true;
                }
                setDisplayModeOn(widget.data, this, widgetElement, menu, bin, jsbin, _this_id);
              });
            }
          })(evt, this_id);
        });
      })(thisid);
    })(this);
 }); 
/////////// END WIDGET ONRENDERED



//////////// EVENTS

  function insert_code(jsbin_id, codeString, codeStringRe, comments){

    var editors = document.getElementById(jsbin_id).contentWindow.editors;

    if(!editors){
      return true;
    }
    var code = editors.javascript.getCode();
    var line = editors.javascript.editor.getCursor().line;
    var charpos = editors.javascript.editor.getCursor().ch;
    // make sure it's not already in there:
    var codeRe = new RegExp("\/\/ *c4_requires[\\s\\S]*\\[[\\s\\S]*"+codeStringRe+"[\\s\\S]*\\] *,[\\s\\S]*\/\/ *end_c4_requires");
    var codeMatch = code.match(codeRe);
    if(!codeMatch){
      // match to empty array
      var match = /(\/\/ *c4_requires[\s\S]*\[)\s*(\] *,[\s\S]*\/\/ *end_c4_requires)/;
      var results = code.match(match);
      newcode = code.replace(match, "$1\n"+codeString+" // "+comments+"\n$2")

      if(newcode == code){
        // match to non-empty array
        var match = /(\/\/ *c4_requires[\s\S]*\[)([^\]]*\] *,[\s\S]*\/\/ *end_c4_requires)/;
        var results = code.match(match);
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
  }


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
      $("#webservice_insert_modal").modal('show');

      $("#webservice_insert_modal_submit").click(function(){
        var jsbin_id = 'jsbin_'+template.data.url;


        var url = $("#webservice_insert_url").val().trim();
        var name = $("#webservice_insert_name").val().trim();
        var auth_token = $("#webservice_insert_auth_token").val().trim();
        var return_type = $("input[name=webservice_insert_return_type]:checked").val().trim();

        url = url.replace("||PAGEID||" , "'+pageId()+'");
        url = url.replace("||PAGETYPE||" , "'+pageType()+'");

        var token_string;
        if(auth_token){
          token_string = " \n authentication_token : '"+auth_token+"',";
        }

        var codeString = "{\n id:'"+name+"', \n type: 'webservice', "+ token_string +" \n return_type: '"+return_type+"', \n url: '"+ url+"' \n}"
        var codeStringRe = "\\{\n id:'"+name+"', \n type: 'webservice', \n return_type: '"+return_type+"', \n url: '"+ url+"' \n\\}"
        var comments = " this will hold a " +return_type +" object";

        insert_code(jsbin_id, codeString, codeStringRe, comments);

      /* need to insert something like:
{
    id : "vasearch",
    type :"webservice", 
    return_type : "JSON" or "HTML"
    url : "http://www.vam.ac.uk/api/json/museumobject/search?q="+pageid()}

      */

      });


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

      var jsbin_id = 'jsbin_'+template.data.url;

      insert_code(jsbin_id, codeString, codeStringRe, comments);

      return true;
    },



    "click .test": function () {
      console.log("testing widget thing");
      var thiselement = document.getElementById('widgetContainer_'+this._id);
      var editors = document.getElementById('jsbin_'+this._id).contentWindow.editors;
      var jsbin = document.getElementById('jsbin_'+this._id).contentWindow.jsbin;
      var menu = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("control");
      var bin = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("bin");
//      console.log(editors);
//      console.log(jsbin);

//      console.log(thiselement);

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
      setDisplayModeOn(this, iframeElement, widgetElement, menu, bin, jsbin, this._id);

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
                    displayWidth: template.displayWidth,
                    displayHeight: template.displayHeight,
                    description: "(copied from " + template.name +") " + template.description,
                    widgetStyle : template.widgetStyle,
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

    "click .save_to_library": function () {
      this.isTemplate = !this.isTemplate;
//      Widgets.update(this._id, this);

      var template = Widgets.findOne({url : this.url}); //.map(setWidgetDefaults);
      var dataobj = {html : template.html, css: template.css, javascript: template.javascript};
      var url = "/api/save";//?js="+jsstring+"&html="+htmlstring+"&css="+csstring,
      var options = {data: dataobj};

      var newpagetype = "user_libs";
      var newpageid = Meteor.user().username;
      var newpageurl = newpagetype + "/" + newpageurl;
      
      HTTP.post(url, options, function(error, results){
        console.log("data submitted");
        newWidget = {_id: results.data.url,
                    createdBy : { username : Meteor.user().username,
                    userid : Meteor.userId() },
                    inLibrary : true,
                    html : results.data.html,
                    javascript : results.data.javascript,
                    css: results.data.css,
                    displayWidth: template.displayWidth,
                    displayHeight: template.displayHeight,
                    description: "(copied from " + template.name +") " + template.description,
                    widgetStyle : template.widgetStyle,
                    name : "copy of " + template.name,
                    pagetype : newpagetype,
                    pageurl : newpageurl,
                    pageid : newpageid,
                    this_page_only : true,
                    url: results.data.url,
                    createdAt: new Date(),
                    rand: Math.random() };
        Widgets.insert(newWidget);
      });

      giphy_modal("library", "widget added to your library");

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
////// END EVENTS


////// HELPERS

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
//////// END HELPERS



}