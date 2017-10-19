'use strict';
import * as vscode from 'vscode';
import { TextEditor, window } from "vscode";
import { alObject } from './alobject';

export function refactor(editor: TextEditor) {

    // Step 1 is to grab the selected text, this should be tested since it has to be one function and extratable...

    let oldSelection = editor.selection;

    if (editor.selection.start.isEqual(editor.selection.end)) {
        window.showErrorMessage('Select something dude');
        return;
    }
    let alCode = editor.document.getText(oldSelection);
    let myObject = new alObject(editor);

    console.log(alCode);
    var newFunctioName: string = "foo";

    //    newFunctioName = window.showInputBox({
    //        prompt: `Function name for '${alCode[1]}':`,
    //        value: 'foo'
    //    });

    editor.edit(editBuilder => {
        editBuilder.replace(new vscode.Position(myObject.lastLineNumber, 0),
            getProcedureTemplate(newFunctioName, alCode));

        editBuilder.replace(oldSelection, newFunctioName + '; // Refactored, remove comment when happy\n');
    });

}

function getProcedureTemplate(functionName: string, oldCode: string): string {
    return ('  PROCEDURE ' + functionName + '();\nbegin\n' + oldCode + 'end;\n');
}

