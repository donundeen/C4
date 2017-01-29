 
if (Meteor.isClient) {

/////// FUNCTION DEFS
  var dix = 0;

  function setDisplayModeOn(widgetData, iframeElement, widgetElement, menu, bin, jsbin, widgetid, isnew){
    var grid = $(".grid-stack").data("gridstack");
    var griditem = $(widgetElement).parent().parent();
    var result = grid.resize(griditem, widgetData.width_in_cells, widgetData.height_in_cells);

    // get the size of the navbar, subtract from height of iframe

    dix++;
    var di = dix;
    var newbintop = 0;
    $(menu).hide();

    $(".editmodeonly", widgetElement).hide();
    $(".displaymodeonly", widgetElement).show();
    iframeElement.oldbintop = $(bin).css("top");
    $(bin).css("top", newbintop);
    $(widgetElement).attr("style", widgetData.usableWidgetStyle);

    $(widgetElement).css("border-radius", "10px");
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
    $(iframeElement).css("border-radius", "10px");

    var initialH = $(griditem).height();
    var finalh = initialH;
    var initialW = $(griditem).width();
    var finalw = initialW;
    $(widgetElement).width(finalw - 35);
    $(widgetElement).height(finalh - 15);

    $(iframeElement).css("max-height", "");
    $(iframeElement).css("max-width", "");
    $(iframeElement).css("min-height", "");
    $(iframeElement).css("min-width", "");

    $(iframeElement).width(finalw - 35);
    $(iframeElement).css("max-width", finalw - 35 );
    $(iframeElement).height(finalh - 25);
    $(iframeElement).css("max-height", finalh - 25 );
    $(iframeElement).css("min-height", finalh - 25 );

  }


  function setEditModeOn(widgetData, iframeElement, widgetElement, menu, bin, jsbin){
    var grid = $(".grid-stack").data("gridstack");
    var griditem = $(widgetElement).parent().parent();
    if(jsbin){
      jsbin.panels.show("html");
      jsbin.panels.show("javascript");
    }
    $(".lock", widgetElement).hide();
    $(".unlock", widgetElement).show();
//      editors.panels.show("css");

    var newbintop = 0;

    grid.resize(griditem, 12, 6);

    // put it in EDIT MODE
    $(menu).show();
    $(".editmodeonly", widgetElement).show();
    $(".displaymodeonly", widgetElement).hide();
    $(bin).css("top", iframeElement.oldbintop);
    $(widgetElement).css("border-radius", "10px");
    $(iframeElement).css("border-radius", "10px");

    // ".navbar-collapse"
    var height_adjust = $(".navbar-collapse", widgetElement).height() - 20;
    // adjust for height of menu


    var initialH = $(griditem).height();
    var finalh = initialH;
    var initialW = $(griditem).width();
    var finalw = initialW;
    $(widgetElement).width(finalw - 25);
    $(widgetElement).height(finalh - 15);

    $(iframeElement).css("max-height", "");
    $(iframeElement).css("max-width", "");
    $(iframeElement).css("min-height", "");
    $(iframeElement).css("min-width", "");

    $(iframeElement).width(finalw - 25);
    $(iframeElement).css("max-width", finalw - 25 );
    $(iframeElement).height(finalh - 25 - height_adjust);
    $(iframeElement).css("max-height", finalh - 25 );
    $(iframeElement).css("min-height", finalh - 25 );

  }
/////// END FUNCTION DEFS



  Template.gridwidgets.onRendered(function(){
      // set whatever gridStack options you want
    var options = {
      width: 12,
      auto: false,
      cellHeight: 60,
      cellWidth: 60,
      alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      resizable: {
          handles: 'e, se, s, sw, w'
      }
    }
    var $gridstack = this.$('.grid-stack');
    // initialise gridstack
    $gridstack.gridstack(options);

    $(window).resize(function(evt){
      if(evt.target == window){
        var grid = $(".grid-stack").data("gridstack");
        $(".grid-stack-item").each(function(index){
          var element = this;
          var initialH = $(element).height();
          var finalh = initialH;
          var initialW = $(element).width();
          var finalw = initialW;
          var cellw = grid.cellWidth();
          var cellh = grid.cellHeight();
          var cells_wide = $(element).data("gs-width");
          var cells_high = $(element).data('gs-height');

          var widgetElement = $(".widgetContainer",element);
          var iframeElement = $(".jsbin-embed", element);

          $(widgetElement).width(finalw - 25);
          $(widgetElement).height(finalh - 15);

          $(iframeElement).css("max-height", "");
          $(iframeElement).css("max-width", "");
          $(iframeElement).css("min-height", "");
          $(iframeElement).css("min-width", "");

          $(iframeElement).width(finalw - 35);
          $(iframeElement).css("max-width", finalw - 35 );
          $(iframeElement).height(finalh - 25);
          $(iframeElement).css("max-height", finalh - 25 );

        });
      }
    });



    $('.grid-stack').on('dragstop', function(event, ui){
      // for some reason the moved grid-item doesn't have access to the widgetId data attribute, so get it here and hang onto it.
      var target_url = $(event.target).data("widget-id");
      // save new order when items are moved.        
      var grid = $(this).data('gridstack');
      var nodes = grid.grid.nodes;
      for(var i = 0; i < nodes.length; i++){
        var node = nodes[i];
        var id = $(node.el).data('widgetId');
        // get widget code, update sort-order
        if(typeof id == "undefined"){
          id = target_url;
        }
        if(typeof id != "undefined"){
          (function(_id){
            var widget = Widgets.findOne({url : _id}); //.map(setWidgetDefaults);
            widget.sort_order = i;
            Widgets.update(widget._id, widget, {}, function (arg1, arg2){
            });
          })(id);
        }else{
//            console.log(node);
        }
      }
    });

    $('.grid-stack').on('resizestop', function(event, items) {
      var grid = this;
      var element = event.target;
      var widgetElement = $(".widgetContainer",element);
      var iframeElement = $(".jsbin-embed", element);
      // need to wait just a bit for the size to quantize to the grid...
      setTimeout(function(){
        var initialH = $(element).height();
        var finalh = initialH;
        var initialW = $(element).width();
        var finalw = initialW;
        var widgetID = $(widgetElement).data("url");
        var widget = Widgets.findOne({url : widgetID}); //.map(setWidgetDefaults);
        $(widgetElement).width(finalw - 35);
        $(widgetElement).height(finalh - 15);

        $(iframeElement).css("max-height", "");
        $(iframeElement).css("max-width", "");
        $(iframeElement).css("min-height", "");
        $(iframeElement).css("min-width", "");

        $(iframeElement).width(finalw - 35);
        $(iframeElement).css("max-width", finalw - 35 );
        $(iframeElement).height(finalh - 25);
        $(iframeElement).css("max-height", finalh - 25 );

        var cellw = $(grid).data("gridstack").opts.cellWidth;
        var cellh = $(grid).data("gridstack").opts.cellHeight;
        var cells_wide = $(element).data("gs-width");
        var cells_high = $(element).data('gs-height');

        widget.width_in_cells= cells_wide;
        widget.height_in_cells = cells_high;
        widget.width_in_px = finalw;
        widget.height_in_px = finalh;
        Widgets.update(widget._id, widget);
      }, 350);

    });

    $('.grid-stack').data("inited", true);

  });

/////// WIDGET ONRENDERED
  // In the client code, below everything else
  Template.widget.onRendered(function(){
    var thisisnew = false;

    if(justaddedid == this.data._id){
      thisisnew = true; // this node was just added.
    }
    var context = Template.currentData();
    var firstNode = this.firstNode;
    var firstNodeId = $(firstNode).data("widget-id");
    var lastNode = this.lastNode;
    var lastNodeId = $(lastNode).data("widget-id");

    var grid = $(".grid-stack").data('gridstack');
    var widgetElement = $("#widgetContainer_"+this.data._id);
    var griditem = $(widgetElement).parent().parent();

    if (!thisisnew && grid){
      console.log("widget Rendered");
      console.log(this.data._id);
      console.log(this.data.sort_order);
      grid.addWidget(this.$('.grid-stack-item'));
    }else{
      console.log("no grid?");
    }
    // find out if the widget has been added to the grid.

    if(thisisnew){
      grid.makeWidget(griditem);  
      grid.move(griditem, 0,0);
      var node = grid.grid.getNodeDataByDOMEl(griditem);
    //  grid.grid._fixCollisions(griditem);
    }
    if(!$('.grid-stack').data("inited")){

    }
    // end resizable grid setup



    (function(widget, isnew){
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
            editors = theElement.contentWindow.editors;
            jsbin = theElement.contentWindow.jsbin;
            menu = theElement.contentWindow.document.getElementById("control");
            bin = theElement.contentWindow.document.getElementById("bin");   
            var thiselement = document.getElementById('widgetContainer_'+thisid);
            if(jsbin && jsbin.panels){
              jsbin.panels.saveOnExit = true;
            }     
            setDisplayModeOn(widget.data, this, widgetElement, menu, bin, jsbin, thisid, isnew);
          }else{
            console.log("no element found for jsbin_"+thisid);
          }
        });
      }
      // this part here happens when the JSBIN stuff is loaded.
      (function(this_id, isnew){
        if(isnew){
          var widgetElement = document.getElementById('widgetContainer_'+this_id);
          var editors = jsbin = menu = bin = null;
          var theElement = document.getElementById('jsbin_'+this_id);
          if(theElement){
            editors = theElement.contentWindow.editors;
            jsbin = theElement.contentWindow.jsbin;
            menu = theElement.contentWindow.document.getElementById("control");
            bin = theElement.contentWindow.document.getElementById("bin");
            if(jsbin && jsbin.panels){
              jsbin.panels.saveOnExit = true;
            }
            setDisplayModeOn(widget.data, this, widgetElement, menu, bin, jsbin, this_id, isnew);
          }else{
            console.log("no element found for jsbin_"+this_id);
          }          
        }


        document.addEventListener("DOMNodeInserted", function(evt, item){
          (function(_evt, _this_id, isnew){
            if($(_evt.target)[0].tagName == "IFRAME" && $(_evt.target)[0].id.replace("jsbin_","") == _this_id){
              $((_evt.target)).load(function(){
                var widgetElement = document.getElementById('widgetContainer_'+_this_id);
                var editors = jsbin = menu = bin = null;
                var theElement = document.getElementById('jsbin_'+_this_id);
                if(theElement){
                  editors = theElement.contentWindow.editors;
                  jsbin = theElement.contentWindow.jsbin;
                  menu = theElement.contentWindow.document.getElementById("control");
                  bin = theElement.contentWindow.document.getElementById("bin");
                  if(jsbin && jsbin.panels){
                    jsbin.panels.saveOnExit = true;
                  }
                  setDisplayModeOn(widget.data, this, widgetElement, menu, bin, jsbin, _this_id, isnew);
                }else{
                  console.log("no element found for jsbin_"+_this_id);
                }
              });
            }
          })(evt, this_id, isnew);
        });
      })(thisid, isnew);
    })(this, thisisnew);
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
    var codeRe = new RegExp("\/\/ *c[45]_requires[\\s\\S]*\\[[\\s\\S]*"+codeStringRe+"[\\s\\S]*\\] *,[\\s\\S]*\/\/ *end_c[45]_requires");
    var codeMatch = code.match(codeRe);
    if(!codeMatch){
      // match to empty array
      var match = /(\/\/ *c[45]_requires[\s\S]*\[)\s*(\] *,[\s\S]*\/\/ *end_c[45]_requires)/;
      var results = code.match(match);
      newcode = code.replace(match, "$1\n"+codeString+" // "+comments+"\n$2")

      if(newcode == code){
        // match to non-empty array
        var match = /(\/\/ *c[45]_requires[\s\S]*\[)([^\]]*\] *,[\s\S]*\/\/ *end_c[45]_requires)/;
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

      var grid = $(".grid-stack").data("gridstack");

      var widgetElement = $("#widgetContainer_"+this._id);
      var griditem = $(widgetElement).parent().parent();

      grid.removeWidget(griditem, true);

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
      var thiselement = document.getElementById('widgetContainer_'+this._id);
      var editors = document.getElementById('jsbin_'+this._id).contentWindow.editors;
      var jsbin = document.getElementById('jsbin_'+this._id).contentWindow.jsbin;
      var menu = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("control");
      var bin = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("bin");

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
    "click .widgetUnlock": function () {

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
    "click .widgetLock": function () {

      var widgetElement = document.getElementById('widgetContainer_'+this._id);
      var iframeElement = document.getElementById('jsbin_'+this._id)

      var editors = iframeElement.contentWindow.editors;
      var jsbin = iframeElement.contentWindow.jsbin;
      var menu = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("control");
      var bin = document.getElementById('jsbin_'+this._id).contentWindow.document.getElementById("bin");
      setDisplayModeOn(this, iframeElement, widgetElement, menu, bin, jsbin, this._id, false);

      return false;
    },


    // setting visibility on widgets (public or private)
    "click .setpublic" : function(){
      this.visibility = "public";
      Widgets.update(this._id, this);
      return false;
    },
    "click .setprivate" : function(){
      this.visibility = "private";
      Widgets.update(this._id, this);
      return false;
    },

    "click .order_up" : function(){
      this.sort_order--;
      Widgets.update(this._id, this);
      return false;
    },

    "click .order_down" : function(){
      this.sort_order++;
      Widgets.update(this._id, this);
      return false;
    },

    "click .nonclickable" : function(){
      return false;
    },


    'click .copy' : function(){
      var template = Widgets.findOne({url : this.url}); //.map(setWidgetDefaults);
      var dataobj = {html : template.html, css: template.css, javascript: template.javascript};
      var url = "/api/save";//?js="+jsstring+"&html="+htmlstring+"&css="+csstring,
      var options = {data: dataobj};
      
      HTTP.post(url, options, function(error, results){
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
                    visibility: "private",
                    rand: Math.random() };
        Widgets.insert(newWidget);
      });

      giphy_modal("copy", "widget copied");

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
                    visibility: "private",
                    rand: Math.random() };
        Widgets.insert(newWidget);
      });

      giphy_modal("library", "widget added to your library");

      return false;
    },

    "click .openinfo" : function(){
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

  widgetIncrement = 0;
  Template.widget.helpers({
    otherwidgets: function () {
        // Otherwise, return all of the tasks
        return Widgets.find({pagetype : pageinfo().pagetype, _id : {$ne : this._id}}, {sort: {createdAt: -1}}).map(setWidgetDefaults); 
    },

    isPublic :  function(){
      if(this.visibility == "public"){
        return true;
      }
      return false;
    },

    pageTypeAndUrl : function(){

      return "_pt_"+this.pagetype + "/"+ this.url;
    },

    pageUrlAndUrl : function(){
      return "_pu_"+pageinfo().pageurl + "/" + this.url;
    },

    commentsCount : function(id){
      var value = "";
      return value;
    },

    isMyWidget : function (){
      // is this a widget I created?
      if(getUserXtras().godmode){
        return true;
      }
      if(this.createdBy && Meteor.user()){
        return this.createdBy.username == Meteor.user().username;
      }else{
        return false;
      }
    },

    widgetIncrement : function(){
      var ret = widgetIncrement;
      if(typeof this.widgetIncrement =="undefined"){
        this.widgetIncrement = widgetIncrement;
        widgetIncrement++;
      }else{
        ret = this.widgetIncrement;
      }
      return ret;
    },

    userXtras : function(){
      return getUserXtras();
    },

    godmode : function(){
      return getUserXtras().godmode;

    }    
  });



  Template.allWidgetsLoaded.onRendered(function(){
    console.log("aaaaaall widgets loaded");
  });
  //////// END HELPERS
}