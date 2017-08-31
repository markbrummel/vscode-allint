'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    console.log('The NAV-Skills Clean Code Extension is loaded...');
    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    //console.log('Congratulations, your extension "WordCount" is now active!');
    // create a new word counter
    let maintainabilityIndex = new MaintainabilityIndex();
    let controller = new MaintainabilityIndexController(maintainabilityIndex);
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(maintainabilityIndex);
    let ccode = new CleanCode();
    let refactordisp = vscode_1.commands.registerCommand('Refactor', () => {
        ccode.Refactor(vscode_1.window.activeTextEditor);
    });
    let ccodedisp = vscode_1.commands.registerCommand('CleanCode', () => {
        ccode.CleanCode(vscode_1.window.activeTextEditor);
        maintainabilityIndex.updateMaintainabilityIndex();
    });
    context.subscriptions.push(maintainabilityIndex);
    context.subscriptions.push(refactordisp);
    context.subscriptions.push(ccodedisp);
}
exports.activate = activate;
// this method is called when your extension is deactivated
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
            let maintainabilityIndex = this._getMaintainabilityIndex(doc);
            // Update the status bar
            this._statusBarItem.text = maintainabilityIndex !== 1 ? `Maintainability Index ${maintainabilityIndex}` : 'Maintainability Index Undefined';
            this._statusBarItem.show();
        }
        else {
            this._statusBarItem.hide();
        }
    }
    _getMaintainabilityIndex(doc) {
        let docContent = doc.getText();
        // Parse out unwanted whitespace so the split is accurate
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount = 0;
        if (docContent != "") {
            wordCount = docContent.split(" ").length;
        }
        return wordCount;
    }
    dispose() {
        this._statusBarItem.dispose();
    }
}
class MaintainabilityIndexController {
    constructor(wordCounter) {
        this._maintainabilityIndex = wordCounter;
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
class CleanCode {
    Refactor(editor) {
        let line = editor.document.lineAt(editor.selection.active.line);
        this.RefactorToFunction(line);
    }
    CleanCode(editor) {
        this.CleanCodeCheck(editor);
    }
    RefactorToFunction(line) {
        console.log('Refactor' + line.text);
    }
    CleanCodeCheck(editor) {
        console.log('CleanCode' + editor.document.lineCount);
        let myObject = new alObject(editor.document.getText(new vscode_1.Range(0, 0, 1000, 1000)));
        console.log("Object Type :" + myObject.objectType);
        console.log("Number of Functions :" + myObject.numberOfFunctions);
        myObject.alFunction.forEach(element => {
            console.log("Function Name : " + element.name);
            element.alVariable.forEach(element => {
                console.log("Variable Name : " + element.name + " Type : " + element.type);
            });
            //console.log("Number Of Lines : " + element.numberOfLines);
            //console.log("Complexity : " + element.cycolomaticComplexity);
        });
        vscode_1.window.showInformationMessage("Number of Functions :" + myObject.numberOfFunctions);
        //window.showWarningMessage("Foo");
        let diagnostics = [];
        let lines = editor.document.getText().split(/\r?\n/g);
        lines.forEach((line, i) => {
            let index = line.indexOf('COMMIT');
            if (index >= 0) {
                let test = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + 10)), 'Commit is dangerous and should be avoided (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
                diagnostics.push(test);
            }
        });
        let alDiagnostics = vscode_1.languages.createDiagnosticCollection("alDiagnostics");
        alDiagnostics.set(editor.document.uri, diagnostics);
    }
}
class alObject {
    constructor(content) {
        this.content = content;
        this.test = ["0", "1"];
        this.alFunction = [];
        var functions = content.toUpperCase().split("PROCEDURE");
        for (var i = 1; i < functions.length; i++) {
            var test = functions[i];
            this.alFunction.push();
            var p = i - 1;
            this.alFunction[p] = new alFunction(functions[i]);
        }
        this.numberOfFunctions = this.content.split("PROCEDURE ").length - 1;
        this.objectType = getObjectType(content);
    }
    getContent() {
        return this.content;
    }
    getNumberOfFunctions() {
        return this.content.split("PROCEDURE ").length - 1;
    }
}
class alFunction {
    constructor(content) {
        this.content = content.trim();
        this.contentUpperCase = this.content.toUpperCase();
        this.numberOfLines = this.content.split("\n").length;
        this.name = getCharsBefore(this.content, "(");
        let lines = this.content.split(/\r?\n/g);
        var inCodeSection = false;
        var inVariableSection = false;
        this.alVariable = [];
        this.businessLogic = "";
        var p = 0;
        // Get Variables
        lines.forEach((line, i) => {
            if (i == 0) {
                var variableString = line.substring(line.indexOf('('));
                if (variableString.endsWith(');')) {
                    variableString = variableString.substring(1, variableString.length - 1);
                }
                else {
                    this.returnValue = variableString.substring(variableString.indexOf(')'));
                    variableString = variableString.substring(1, variableString.length - this.returnValue.length);
                    this.returnValue.replace(':', '').replace(';', '');
                }
                let variables = variableString.split(';');
                variables.forEach((variable, i) => {
                    this.alVariable.push();
                    this.alVariable[p] = new alVariable(variable);
                    this.alVariable[p].local = true;
                    this.alVariable[p].parameter = true;
                    p++;
                });
                // breaddownProcedureVariables(line);
            }
            if ((i == 1) && (line.indexOf('VAR') > 0)) {
                inVariableSection = true;
            }
            if ((inCodeSection) && (line.length > 0)) {
                this.businessLogic = this.businessLogic + line.trim();
            }
            if (line.indexOf('BEGIN') > 0) {
                inVariableSection = false;
                inCodeSection = true;
            }
            if ((inVariableSection) && (i > 1)) {
                this.alVariable[p] = new alVariable(line);
                p++;
            }
        });
        this.length = getLength(this.businessLogic);
        this.cycolomaticComplexity = (this.contentUpperCase.split("IF ").length - 1) +
            (this.contentUpperCase.split("CASE ").length - 1) + (this.contentUpperCase.split("ELSE ").length - 1);
        this.vocabulary = this.distinctOperands + this.distinctOperators;
        //this.length = this.numberOfOperands + this.numberOfOperators;
        this.halsteadVolume = this.length * Math.log2(this.vocabulary);
    }
}
class alVariable {
    constructor(value) {
        this.content = value.trim().replace(';', '').replace(')', '');
        if (this.content.startsWith('VAR')) {
            this.content = this.content.substring(4);
            this.byRef = true;
        }
        this.name = this.content.substring(0, this.content.indexOf(':') - 1);
        this.type = this.content.substring(this.content.indexOf(':') + 2);
        if (this.type.indexOf(' ') > 0) {
            this.objectId = this.type.substring(this.type.indexOf(' ') + 1);
            this.type = this.type.substring(0, this.type.indexOf(' '));
        }
        if (this.content.endsWith(']')) {
            this.length = this.content.substring(this.content.indexOf('[') + 1, this.content.indexOf(']'));
        }
    }
}
function getCharsBefore(str, chr) {
    var index = str.indexOf(chr);
    if (index != -1) {
        return (str.substring(0, index));
    }
    return ("");
}
function getObjectType(str) {
    switch (getCharsBefore(str.toUpperCase(), " ")) {
        case "TABLE":
            return (1);
        case "CODEUNIT":
            return (4);
    }
    return (0);
}
function getLength(businessLogic) {
    var vocabulary = 0;
    var word = "";
    var allWords = [];
    // To Do : String is one operator
    for (var i = 0; i < businessLogic.length; i++) {
        if (businessLogic.charAt(i) == ' ') {
            vocabulary++;
            allWords.push();
            word = "";
        }
        else if (businessLogic.charAt(i) == '.') {
            vocabulary++;
            word = "";
        }
        else if (businessLogic.charAt(i) == ',') {
            vocabulary++;
            word = "";
        }
        else
            word = word + businessLogic.charAt(i);
    }
    return vocabulary;
    //    let docContent = doc.getText();
    // Parse out unwanted whitespace so the split is accurate
    //    docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
    //    docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    //    let wordCount = 0;
    //    if (docContent != "") {
    //        wordCount = docContent.split(" ").length;
    //    }
    //    return wordCount;
}
//# sourceMappingURL=extension.js.map