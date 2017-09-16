'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
const refactor_1 = require("./refactor");
const diagnostics_1 = require("./diagnostics");
const alobject_1 = require("./alobject");
function activate(context) {
    console.log('The NAV-Skills Clean Code Extension is loaded...');
    let maintainabilityIndex = new MaintainabilityIndex();
    let controller = new MaintainabilityIndexController(maintainabilityIndex);
    context.subscriptions.push(controller);
    context.subscriptions.push(maintainabilityIndex);
    let refactordisp = vscode_1.commands.registerCommand('Refactor', () => {
        refactor_1.refactor(vscode_1.window.activeTextEditor);
    });
    let ccodedisp = vscode_1.commands.registerCommand('CleanCode', () => {
        //      ccode.CleanCode(window.activeTextEditor);
        //      maintainabilityIndex.updateMaintainabilityIndex();
    });
    context.subscriptions.push(maintainabilityIndex);
    context.subscriptions.push(refactordisp);
    context.subscriptions.push(ccodedisp);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
class MaintainabilityIndex {
    updateMaintainabilityIndex() {
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        }
        // Get the current text editor
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        let doc = editor.document;
        // Only update status if an Markdown file
        if (doc.languageId === "al") {
            let myObject = new alobject_1.alObject(editor);
            diagnostics_1.getDiagnostics(editor, myObject);
            let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));
            if (config.statusbar) {
                let maintainabilityIndex = myObject.getMaintainabilityIndex(editor.document.lineAt(editor.selection.active.line));
                let cyclomaticComplexity = myObject.getCyclomaticComplexity(editor.document.lineAt(editor.selection.active.line));
                var currentFunctionName = myObject.getCurrentFunction(editor.document.lineAt(editor.selection.active.line));
                var theText = currentFunctionName + ` - Maintainability Index : ${maintainabilityIndex}` + ` Cyclomatic Complexity : ${cyclomaticComplexity}`;
                // Update the status bar
                this._statusBarItem.text = maintainabilityIndex !== 1 ? theText : 'Maintainability Index Undefined';
                if (maintainabilityIndex >= 20) {
                    this._statusBarItem.color = 'lightgreen';
                }
                else if (maintainabilityIndex >= 10) {
                    this._statusBarItem.color = 'orange';
                }
                else if (maintainabilityIndex != 0) {
                    this._statusBarItem.color = 'red';
                }
                this._statusBarItem.show();
            }
        }
        else {
            this._statusBarItem.hide();
        }
    }
    dispose() {
        this._statusBarItem.dispose();
    }
}
class MaintainabilityIndexController {
    constructor(theIndex) {
        this._maintainabilityIndex = theIndex;
        // subscribe to selection change and editor activation events
        let subscriptions = [];
        vscode_1.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode_1.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        // update the counter for the current file
        this._maintainabilityIndex.updateMaintainabilityIndex();
        // create a combined disposable from both event subscriptions
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable.dispose();
    }
    _onEvent() {
        this._maintainabilityIndex.updateMaintainabilityIndex();
    }
}
//# sourceMappingURL=extension.js.map