'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
// var i:number = 0;
// for (1;i<editor.document.lineCount;1){
//     let range = new Range(i, 0, i, 1000);
//     let testText = editor.document.getText(range);
//     console.log('Line ' + i+1 + ' - ' + testText);
//     i+=1;
// }
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    console.log('The NAV-Skills Clean Code Extension is loaded...');
    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    //console.log('Congratulations, your extension "WordCount" is now active!');
    // create a new word counter
    let wordCounter = new WordCounter();
    let controller = new WordCounterController(wordCounter);
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(wordCounter);
    let ccode = new CleanCode();
    let refactordisp = vscode_1.commands.registerCommand('Refactor', () => {
        ccode.Refactor(vscode_1.window.activeTextEditor);
    });
    let ccodedisp = vscode_1.commands.registerCommand('CleanCode', () => {
        ccode.CleanCode(vscode_1.window.activeTextEditor);
        wordCounter.updateWordCount();
    });
    context.subscriptions.push(wordCounter);
    context.subscriptions.push(refactordisp);
    context.subscriptions.push(ccodedisp);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
class WordCounter {
    updateWordCount() {
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
            let wordCount = this._getWordCount(doc);
            // Update the status bar
            this._statusBarItem.text = wordCount !== 1 ? `${wordCount} Words` : '1 Word';
            this._statusBarItem.show();
        }
        else {
            this._statusBarItem.hide();
        }
    }
    _getWordCount(doc) {
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
class WordCounterController {
    constructor(wordCounter) {
        this._wordCounter = wordCounter;
        // subscribe to selection change and editor activation events
        let subscriptions = [];
        vscode_1.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode_1.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        // update the counter for the current file
        this._wordCounter.updateWordCount();
        // create a combined disposable from both event subscriptions
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable.dispose();
    }
    _onEvent() {
        this._wordCounter.updateWordCount();
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
        //console.log(alObject.getContent());
        console.log("Object Type :" + myObject.objectType);
        console.log("Number of Functions :" + myObject.numberOfFunctions);
        myObject.alFunction.forEach(element => {
            //console.log(element.content);
            console.log("Function Name : " + element.name);
            console.log("Number Of Lines : " + element.numberOfLines);
            console.log("Complexity : " + element.cycolomaticComplexity);
        });
        vscode_1.window.showInformationMessage("Number of Functions :" + myObject.numberOfFunctions);
        vscode_1.window.showWarningMessage("Foo");
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
        // Send the computed diagnostics to VS Code.
        //connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
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
        this.content = content;
        this.contentUpperCase = content.toUpperCase();
        this.numberOfLines = content.split("\n").length;
        this.name = getCharsBefore(content, "(");
        this.cycolomaticComplexity = (this.contentUpperCase.split("IF ").length - 1) +
            (this.contentUpperCase.split("CASE ").length - 1) + (this.contentUpperCase.split("ELSE ").length - 1);
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
//# sourceMappingURL=extension.js.map