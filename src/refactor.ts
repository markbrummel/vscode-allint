'use strict';
import * as vscode from 'vscode';
import { TextLine, TextEditor, commands, window, ExtensionContext, Range, Position, StatusBarItem, StatusBarAlignment, TextDocument, Disposable, DiagnosticSeverity, Diagnostic, languages } from "vscode";

export function refactor(editor: TextEditor) {
//    window.showInformationMessage('Mark');
   // editor.document.    
    
    // Step 1 is to grab the selected text, this should be tested since it has to be one function and extratable...

    let oldSelection = editor.selection;

    if (editor.selection.start.isEqual(editor.selection.end)) {
        window.showErrorMessage('Select something dude');
        return;
    }
    let alCode = editor.document.getText(oldSelection);

    console.log(alCode);
    var defaultName : string = "";
    
//    console.log(window.showInputBox({
//        prompt: `Function name for '${alCode[1]}':`,
//        value: defaultName
//    }));

    editor.edit(editBuilder => {
        editBuilder.replace(oldSelection, 'MARK WAS HERE AND REMOVED YOUR CODE');

        let extraLines = 0;

        if (1==1) {
            editBuilder.insert(new vscode.Position(0, 0), 'AND SOME CODE HERE');
            extraLines = 1;
        }
    });

    //console.log(window.showInputBox(new vscode.InputBoxOptions()));
    //editor.
    //editor.insertSnippet(new vscode.SnippetString('tprodedure'));
    console.log('Refactor');

}    