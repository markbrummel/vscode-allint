'use strict';
import * as vscode from 'vscode';
import { TextLine, TextEditor, commands, window, ExtensionContext, Range, Position, StatusBarItem, StatusBarAlignment, TextDocument, Disposable, DiagnosticSeverity, Diagnostic, languages } from "vscode";
const open = require('opn');

export function getAlObject(editor: TextEditor) {
//    let myObject = new alObject(editor);
//    getDiagnostics(editor, myObject);

  //  return(myObject);
}    

class CleanCode {
    public CleanCode(editor: TextEditor) {
        this.CleanCodeCheck(editor);
    }

    private CleanCodeCheck(editor: TextEditor) {
        console.log('CleanCode' + editor.document.lineCount);

//        let myObject = new alObject(editor);
//        getDiagnostics(editor, myObject);

        var htmlURL : string = "file:///C:/Users/markb/vscode-allint/allint.html?ddd3=mark"

        open(htmlURL);
        window.showInformationMessage(htmlURL);
  //      window.showInformationMessage(JSON.stringify(myObject.getSummary));

    }
}
