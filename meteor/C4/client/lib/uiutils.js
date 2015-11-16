

addJsCodeAtTop = function(snippet, editors){
    var code = editors.javascript.getCode(),
    state = { line: editors.javascript.editor.currentLine(),
        character: editors.javascript.editor.getCursor().ch,
        add: 0
    };

    code = snippet + '\n' + code;

    editors.javascript.setCode(code);
    editors.javascript.editor.setCursor({ line: state.line + state.add, ch: state.character });
}
addJsCodeAtBottom = function(snippet, editors){
    var code = editors.javascript.getCode(),
    state = { line: editors.javascript.editor.currentLine(),
        character: editors.javascript.editor.getCursor().ch,
        add: 0
    };

    code = code +'\n' + snippet;

    editors.javascript.setCode(code);
    editors.javascript.editor.setCursor({ line: state.line + state.add, ch: state.character });
}

addJsCodeAtCursor = function(snippet, editors){
    var code = editors.javascript.getCode();
    var line = editors.javascript.editor.getCursor().line;
    var charpos = editors.javascript.editor.getCursor().ch;
    var codelines = code.split("\n");
    var codeline = codelines[line];
    var newline = codeline.substr(0, charpos) + snippet + codeline.substr(charpos);

    codelines[line] = newline;
    code = codelines.join("\n");

    var state = { line: editors.javascript.editor.currentLine(),
        character: editors.javascript.editor.getCursor().ch,
        add: 0
      };

    editors.javascript.setCode(code);
    editors.javascript.editor.setCursor({ line: state.line + state.add, ch: state.character });
}

addJsRequireCode = function(widgetName, type, editors){
    var code = editors.javascript.getCode();
    var codeString = widgetName + " : '"+type+"'";
    var matches = /c4_requires[\s\S]*(\{[\s\S]+\})[\s\S]*end_c4_requires/.matches(code);
    console.log(matches);


}

