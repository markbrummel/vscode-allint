'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const open = require('opn');
function getAlObject(editor) {
    //    let myObject = new alObject(editor);
    //    getDiagnostics(editor, myObject);
    //  return(myObject);
}
exports.getAlObject = getAlObject;
class CleanCode {
    CleanCode(editor) {
        this.CleanCodeCheck(editor);
    }
    CleanCodeCheck(editor) {
        console.log('CleanCode' + editor.document.lineCount);
        //        let myObject = new alObject(editor);
        //        getDiagnostics(editor, myObject);
        var htmlURL = "file:///C:/Users/markb/vscode-allint/allint.html?ddd3=mark";
        open(htmlURL);
        vscode_1.window.showInformationMessage(htmlURL);
        //      window.showInformationMessage(JSON.stringify(myObject.getSummary));
    }
}
//# sourceMappingURL=cleancode.js.map