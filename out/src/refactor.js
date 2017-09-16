'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
function refactor(editor) {
    //    window.showInformationMessage('Mark');
    // editor.document.    
    // Step 1 is to grab the selected text, this should be tested since it has to be one function and extratable...
    let oldSelection = editor.selection;
    if (editor.selection.start.isEqual(editor.selection.end)) {
        vscode_1.window.showErrorMessage('Select something dude');
        return;
    }
    let alCode = editor.document.getText(oldSelection);
    console.log(alCode);
    var defaultName = "";
    //    console.log(window.showInputBox({
    //        prompt: `Function name for '${alCode[1]}':`,
    //        value: defaultName
    //    }));
    editor.edit(editBuilder => {
        editBuilder.replace(oldSelection, 'MARK WAS HERE AND REMOVED YOUR CODE');
        let extraLines = 0;
        if (1 == 1) {
            editBuilder.insert(new vscode.Position(0, 0), 'AND SOME CODE HERE');
            extraLines = 1;
        }
    });
    //console.log(window.showInputBox(new vscode.InputBoxOptions()));
    //editor.
    //editor.insertSnippet(new vscode.SnippetString('tprodedure'));
    console.log('Refactor');
}
exports.refactor = refactor;
//# sourceMappingURL=refactor.js.map