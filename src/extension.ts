'use strict';
import * as vscode from 'vscode';
import { TextLine, TextEditor, commands, window, ExtensionContext, Range, Position, StatusBarItem, StatusBarAlignment, TextDocument, Disposable, DiagnosticSeverity, Diagnostic, languages } from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

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

    let refactordisp = commands.registerCommand('Refactor', () => {
        ccode.Refactor(window.activeTextEditor);
    })
    let ccodedisp = commands.registerCommand('CleanCode', () => {
        ccode.CleanCode(window.activeTextEditor);
        maintainabilityIndex.updateMaintainabilityIndex();
    })
    context.subscriptions.push(maintainabilityIndex);
    context.subscriptions.push(refactordisp);
    context.subscriptions.push(ccodedisp);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class MaintainabilityIndex {
    
    private _statusBarItem: StatusBarItem;

    public updateMaintainabilityIndex() {

        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        // Get the current text editor
        let editor = window.activeTextEditor;
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
        } else { 
            this._statusBarItem.hide();
        }
    }

    public _getMaintainabilityIndex(doc: TextDocument): number {

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

    private _maintainabilityIndex: MaintainabilityIndex;
    private _disposable: Disposable;

    constructor(wordCounter: MaintainabilityIndex) {
        this._maintainabilityIndex = wordCounter;

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // update the counter for the current file
        this._maintainabilityIndex.updateMaintainabilityIndex();

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._maintainabilityIndex.updateMaintainabilityIndex();
    }
}

class CleanCode {
    public Refactor(editor: TextEditor) {
        let line = editor.document.lineAt(editor.selection.active.line);

        this.RefactorToFunction(line);
    }
    public CleanCode(editor: TextEditor) {
        this.CleanCodeCheck(editor);
    }
    private RefactorToFunction(line: TextLine) {
        console.log('Refactor' + line.text);
    }
    private CleanCodeCheck(editor: TextEditor) {
        console.log('CleanCode' + editor.document.lineCount);

        let myObject = new alObject(editor.document.getText(new Range(0,0,1000,1000)));
        console.log("Object Type :" + myObject.objectType);
        console.log("Number of Functions :" + myObject.numberOfFunctions);

        myObject.alFunction.forEach(element => {
            console.log("Function Name : " + element.name);
            console.log("Number Of Lines : " + element.numberOfLines);
            console.log("Complexity : " + element.cycolomaticComplexity);
        })
        window.showInformationMessage("Number of Functions :" + myObject.numberOfFunctions);
        //window.showWarningMessage("Foo");

        let diagnostics: Diagnostic[] = [];
        let lines = editor.document.getText().split(/\r?\n/g);
        lines.forEach((line, i) => {
            let index = line.indexOf('COMMIT');
            if (index >= 0) {
                let test = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + 10)),
                    'Commit is dangerous and should be avoided (NAV-Skills Clean Code)',
                    DiagnosticSeverity.Information);

                diagnostics.push(test);
            }
        })

        let alDiagnostics = languages.createDiagnosticCollection("alDiagnostics");
        alDiagnostics.set(editor.document.uri, diagnostics);

    }
}

const enum alObjectType {
    table = 1,
    page = 2,
    report = 3,
    codeunit = 4,
    query = 5,
    xmlport = 6,
    menusuite = 7
}

class alObject {
    content: string;
    alFunction: alFunction[];
    test: string[];
    numberOfFunctions: number;
    objectType: alObjectType;
    maintainabilityIndex : number;
    constructor(content: string) {
        this.content = content;
        this.test = ["0", "1"];
        this.alFunction = [];

        var functions = content.toUpperCase().split("PROCEDURE");
        for(var i=1; i<functions.length; i++){ 
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
    }1
    getNumberOfFunctions() {
        return this.content.split("PROCEDURE ").length - 1;
    }
}

class alFunction {
    content: string;
    contentUpperCase: string;
    name: string;
    numberOfLines: number;
    cycolomaticComplexity: number;
    maintainabilityIndex : number;
    distinctOperators : number;
    distinctOperands : number;
    numberOfOperators : number;
    numberOfOperands : number;
    vocabulary : number;
    length : number;
    halsteadVolume : number;
    constructor (content :string) {
        this.content = content;
        this.contentUpperCase = content.toUpperCase();
        this.numberOfLines = content.split("\n").length;
        this.name = getCharsBefore(content, "(");
        this.cycolomaticComplexity = (this.contentUpperCase.split("IF ").length -1) +
            (this.contentUpperCase.split("CASE ").length - 1) + (this.contentUpperCase.split("ELSE ").length - 1);
        this.vocabulary = this.distinctOperands + this.distinctOperators;
        this.length = this.numberOfOperands + this.numberOfOperators;
        this.halsteadVolume = this.length * Math.log2(this.vocabulary);
    }

}

function getCharsBefore(str, chr) {
    var index = str.indexOf(chr);
    if (index != -1) {
        return(str.substring(0, index));
    }
    return("");
}

function getObjectType(str) {
    switch (getCharsBefore(str.toUpperCase(), " "))
    {
        case "TABLE":
            return(1);
        case "CODEUNIT":
            return(4);

    }
    return(0);
}