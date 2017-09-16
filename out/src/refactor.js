'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
const alobject_1 = require("./alobject");
function refactor(editor) {
    // Step 1 is to grab the selected text, this should be tested since it has to be one function and extratable...
    let oldSelection = editor.selection;
    if (editor.selection.start.isEqual(editor.selection.end)) {
        vscode_1.window.showErrorMessage('Select something dude');
        return;
    }
    let alCode = editor.document.getText(oldSelection);
    let myObject = new alobject_1.alObject(editor);
    console.log(alCode);
    var newFunctioName = "foo";
    //    newFunctioName = window.showInputBox({
    //        prompt: `Function name for '${alCode[1]}':`,
    //        value: 'foo'
    //    });
    editor.edit(editBuilder => {
        editBuilder.replace(new vscode.Position(myObject.lastLineNumber, 0), getProcedureTemplate(newFunctioName, alCode));
        editBuilder.replace(oldSelection, newFunctioName + '; // Refactored, remove comment when happy\n');
    });
}
exports.refactor = refactor;
function getProcedureTemplate(functionName, oldCode) {
    return ('  PROCEDURE ' + functionName + '();\nbegin\n' + oldCode + 'end;\n');
}
//# sourceMappingURL=refactor.js.map