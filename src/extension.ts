'use strict';
import * as vscode from 'vscode';
import { TextLine, TextEditor, commands, window, ExtensionContext, Range, Position, StatusBarItem, StatusBarAlignment, TextDocument, Disposable, DiagnosticSeverity, Diagnostic, languages } from "vscode";
import { refactor } from './refactor';

const open = require('opn');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    console.log('The NAV-Skills Clean Code Extension is loaded...');
    
    let maintainabilityIndex = new MaintainabilityIndex();
    let controller = new MaintainabilityIndexController(maintainabilityIndex);

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(maintainabilityIndex);

    let ccode = new CleanCode();
    
    let refactordisp = commands.registerCommand('Refactor', () => {
        refactor(window.activeTextEditor);
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
            let myObject = new alObject(editor);
            
            getDiagnostics(editor, myObject);

            let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));
            
            if (config.statusbar) {
                let maintainabilityIndex = myObject.getMaintainabilityIndex(editor.document.lineAt(editor.selection.active.line));
                let cyclomaticComplexity = myObject.getCyclomaticComplexity(editor.document.lineAt(editor.selection.active.line));
                var currentFunctionName : string = myObject.getCurrentFunction(editor.document.lineAt(editor.selection.active.line));

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
        } else { 
            this._statusBarItem.hide();
        }
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

class MaintainabilityIndexController {

    private _maintainabilityIndex: MaintainabilityIndex;
    private _disposable: Disposable;

    constructor(theIndex: MaintainabilityIndex) {
        this._maintainabilityIndex = theIndex;

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
    public CleanCode(editor: TextEditor) {
        this.CleanCodeCheck(editor);
    }

    private CleanCodeCheck(editor: TextEditor) {
        console.log('CleanCode' + editor.document.lineCount);

        let myObject = new alObject(editor);
        getDiagnostics(editor, myObject);
//        let workspace.rootPath:string;

        var htmlURL : string = "file:///C:/Users/markb/vscode-allint/allint.html?ddd3=mark"

        open(htmlURL);
        window.showInformationMessage(htmlURL);
        window.showInformationMessage(JSON.stringify(myObject.getSummary));

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
    objectID: number;
    maintainabilityIndex : number;
    name: string;
    constructor(theText: TextEditor) {
        this.content = theText.document.getText(new Range(0,0,1000,1000));
        this.test = ["0", "1"];
        this.alFunction = [];
        this.maintainabilityIndex = 171;
        this.numberOfFunctions = 0;
        var p : number = 0;
        var functionContent : string = "";
        var startsAt : number = 0;
        var firstTime : boolean = false;

        let lines = this.content.split(/\r?\n/g);
        lines.forEach((line, i) => {
            if (i==0) {
                let objectDetails = line.split(' ');
                objectDetails.forEach((part, n) => {
                    if (n == 2) {
                        //this.objectID = part;
                    }
                    if (n == 3) {
                        this.name = part;
                    }
                })
            }
            if (validProcedureName(line.trim().toUpperCase())) {
                if (firstTime == true) {
                    this.alFunction.push();
                    p++;
                    this.alFunction[p] = new alFunction(functionContent, startsAt, i);
                    if (this.alFunction[p].maintainabilityIndex < this.maintainabilityIndex) {
                        this.maintainabilityIndex = this.alFunction[p].maintainabilityIndex;
                    }
                    functionContent = "";
                }
                firstTime = true;
                startsAt = i + 1;

                this.numberOfFunctions++;
            }
            if (firstTime) {
                functionContent = functionContent + line + '\n';                   
            }
        })         
        this.alFunction.push();
        p++;
        this.alFunction[p] = new alFunction(functionContent, startsAt, lines.length);
        if (this.alFunction[p].maintainabilityIndex < this.maintainabilityIndex) {
            this.maintainabilityIndex = this.alFunction[p].maintainabilityIndex;
        }
        this.objectType = getObjectType(this.content);
    }
    getContent() {
        return this.content;
    }1
    getNumberOfFunctions() {
        return this.content.split("PROCEDURE ").length - 1;
    }
    getCurrentFunction(line : TextLine) : string {
        var currentFuctionName : string = "Not in function";
        this.alFunction.forEach(element => {
            if ((element.startsAtLineNo < line.lineNumber) && (element.endsAtLineNo > line.lineNumber)) {
                currentFuctionName = element.name;
            }
        })
        return(currentFuctionName)
    }
    getMaintainabilityIndex(line : TextLine) : number {
        var currentMaintainabilityIndex : number = 0;
        this.alFunction.forEach(element => {
            if ((element.startsAtLineNo < line.lineNumber) && (element.endsAtLineNo > line.lineNumber)) {
                currentMaintainabilityIndex = element.maintainabilityIndex;
            }
        })
        return(currentMaintainabilityIndex)
    }
    getCyclomaticComplexity(line : TextLine) : number {
        var currentCyclomaticComplexity : number = 0;
        this.alFunction.forEach(element => {
            if ((element.startsAtLineNo < line.lineNumber) && (element.endsAtLineNo > line.lineNumber)) {
                currentCyclomaticComplexity = element.cycolomaticComplexity;
            }
        })
        return(currentCyclomaticComplexity)
    }
    getSummary() : alSummary {
        let mySummary = new alSummary(this);
        return(mySummary);
    }
}

class alFunction {
    content: string;
    contentUpperCase: string;
    name: string;
    alVariable: alVariable[];
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
    returnValue : string;
    businessLogic : string;
    startsAtLineNo : number;
    endsAtLineNo : number;
    isHungarianNotation : boolean = false;
    isLocal : boolean;
    isTrigger : boolean;
    constructor (content :string, startsAt : number, endsAt : number) {
        this.content = content.trim();
        this.startsAtLineNo  = startsAt;
        this.endsAtLineNo = endsAt;
        this.contentUpperCase = this.content.toUpperCase();
        this.numberOfLines = 0;//this.content.split("\n").length;
        this.name = getCharsBefore(this.content, "(");
        this.isLocal = this.name.toUpperCase().startsWith('LOCAL');
        this.isTrigger = this.name.toUpperCase().startsWith('TRIGGER');
        if (this.isTrigger) {
            this.name = this.name.substring(8)                
        }
        else if (this.isLocal) {
            this.name = this.name.substring(16)
        }
        else {
            this.name = this.name.substring(10)    
        }
        let lines = this.content.toUpperCase().split(/\r?\n/g);

        var inCodeSection : boolean = false;
        var inVariableSection : boolean = false;
        this.alVariable = [];
        this.businessLogic = "";
        var p : number = 0;

        // Get Variables
        lines.forEach((line, i) => {
            if (i == 0) {
                var variableString : string = line.substring(line.indexOf('('));
                if (variableString.endsWith(');')) {
                    variableString = variableString.substring(1, variableString.length - 1);                    
                }
                else {
                    this.returnValue = variableString.substring(variableString.indexOf(')'))
                    variableString = variableString.substring(1, variableString.length - this.returnValue.length);
                    this.returnValue.replace(':', '').replace(';', '');
                }
                let variables = variableString.split(';');
                variables.forEach((variable, n) => {
                    this.alVariable.push();
                    this.alVariable[p] = new alVariable(variable, i + startsAt);
                    this.alVariable[p].local = true;
                    this.alVariable[p].parameter = true;
                    p++;
                })
               // breaddownProcedureVariables(line);
            }
            if ((i == 1) && (line.indexOf('VAR') > 0)) {
                inVariableSection = true;
            }
            if ((inCodeSection) && (line.length > 0)) {
                this.businessLogic = this.businessLogic + line.trim();
                this.numberOfLines++;
            }
            if (line.indexOf('BEGIN') > 0) {
                inVariableSection = false;
                inCodeSection = true;
            }
            if ((inVariableSection) && (i > 1)) {
                this.alVariable[p] = new alVariable(line, i + startsAt);
                p++;
            }
        })

        this.length = getHalstead(this.businessLogic, false);
        this.vocabulary = getHalstead(this.businessLogic, true);

        this.cycolomaticComplexity = (this.contentUpperCase.split("IF ").length -1) +
            (this.contentUpperCase.split("CASE ").length - 1) + (this.contentUpperCase.split("ELSE ").length - 1);

        this.halsteadVolume = this.length * Math.log2(this.vocabulary);
        this.maintainabilityIndex = Math.round(Math.max(0,(171 - 5.2 * Math.log(this.halsteadVolume) - 0.23 * (this.cycolomaticComplexity) - 16.2 * Math.log(this.numberOfLines))*100 / 171));
        let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));
        
        if (config.checkhungariannotation) {
            let hungarianOptions = new alHungarianOptions(config.hungariannotationoptions);
            
            hungarianOptions.alHungarianOption.forEach(hungarianOption => {
                if ((hungarianOption.alType == 'FUNCTION') && (this.isHungarianNotation == false)) {
                    this.isHungarianNotation = (this.name.toUpperCase().indexOf(hungarianOption.abbreviation) != -1);
                }
            });    
        }
    }

}

class alVariable {
    content: string;
    name: string;
    local: boolean;
    parameter : boolean;
    byRef : boolean;
    type: string;
    length: string;
    used: number;
    objectId: string;
    lineNumber: number;
    isHungarianNotation: boolean = false;
    suggestedName: string;
    constructor (value : string, lineNo : number) {
        this.content = value.trim().replace(';', '').replace(')', '');
        this.lineNumber = lineNo;
        if (this.content.startsWith('VAR')) {
            this.content = this.content.substring(4);
            this.byRef = true;
        } 
        this.name = this.content.substring(0, this.content.indexOf(':') - 1);
        this.type = this.content.substring(this.content.indexOf(':') + 2)
        if (this.type.indexOf(' ') > 0) {
            this.objectId = this.type.substring(this.type.indexOf(' ') + 1);
            this.type = this.type.substring(0, this.type.indexOf(' '));
        }
        if (this.content.endsWith(']')) {
            this.length = this.content.substring(this.content.indexOf('[') + 1, this.content.indexOf(']'));            
        }
        
        let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));
        
        if (config.checkhungariannotation) {
            let hungarianOptions = new alHungarianOptions(config.hungariannotationoptions);
            
            hungarianOptions.alHungarianOption.forEach(hungarianOption => {
                if ((hungarianOption.alType == this.type) && (this.isHungarianNotation == false)) {
                    this.isHungarianNotation = (this.name.indexOf(hungarianOption.abbreviation) != -1);
                }
            });    
        }
    }
}

class alSummary {
    content: string;
    constructor (alObject :alObject) {
        this.content = alObject.name;
    }
}

class alHungarianOptions {
    content : string;
    alHungarianOption : alHungarianOption[];
    constructor (value : string) {
        this.alHungarianOption = [];
        let hungariannotationoptions = value.split(';');
        hungariannotationoptions.forEach((hungariannotationoption, i) => {
            this.alHungarianOption.push();
            this.alHungarianOption[i] = new alHungarianOption(hungariannotationoption);
        });
    }
}

class alHungarianOption {
    content : string;
    alType : string;
    abbreviation : string;
    constructor (value : string) {
        this.alType = value.substring(0, value.indexOf(',')).toUpperCase();
        this.abbreviation = value.substring(value.indexOf(',') + 1).toUpperCase();        
    }
}

function getDiagnostics(editor : TextEditor, myObject : alObject) {
    let diagnostics: Diagnostic[] = [];
    let lines = editor.document.getText().split(/\r?\n/g);
    
    let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));

    
    lines.forEach((line, i) => {

        myObject.alFunction.forEach((alFunction, p) => {
            if (alFunction.startsAtLineNo == i + 1) {
                if (alFunction.isHungarianNotation) {
                    let index = line.indexOf(alFunction.name);
                    let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alFunction.name.length)),
                    'Hungarian Notation (NAV-Skills Clean Code)',
                    DiagnosticSeverity.Information);
    
                diagnostics.push(myDiagnose);
                        
                }
            }
        });

        let index = line.indexOf('COMMIT');
        if ((index >= 0) && (config.checkcommit)) {
            let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + 10)),
                'A COMMIT is an indication of poorly structured code (NAV-Skills Clean Code)',
                DiagnosticSeverity.Information);

            diagnostics.push(myDiagnose);
        }
        myObject.alFunction.forEach(element => {
            element.alVariable.forEach(element => {
                if ((element.isHungarianNotation) && (element.lineNumber == i + 1)) {
                    let index = line.toUpperCase().indexOf(element.name);
                    let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + element.name.length)),
                    'Hungarian Notation (NAV-Skills Clean Code)',
                    DiagnosticSeverity.Information);
    
                diagnostics.push(myDiagnose);
                        
                }
            });
        });


    })

    let alDiagnostics = languages.createDiagnosticCollection("alDiagnostics");
    alDiagnostics.set(editor.document.uri, diagnostics);
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

function getHalstead(businessLogic: string, unique: boolean): number {
    
    var vocabulary : number = 0;
    var length : number = 0;
    var word : string = "";
    var allWords: string[] = [];
    var p: number = 0;
    var useSpace: boolean = false;
    var usePeriod: boolean = false; 
    var useComma: boolean = false; 
    var useColon: boolean = false;
    var useSemiColon: boolean = false;
    var useParentheses: boolean = false;
    
    // To Do : String is one operator
    for (var i = 0; i < businessLogic.length; i++) {
        if (businessLogic.charAt(i) == ' ') {
            length++;
            if (word != ""){
                allWords.push();
                allWords[p] = word;
                p++;    
            }
            word = "";
            useSpace = true;
        }
        else if (businessLogic.charAt(i) == '.') {
            length++;
            if (word != ""){
                allWords.push();
                allWords[p] = word;
                p++;    
            }
            word = "";
            usePeriod = true;
        }
        else if (businessLogic.charAt(i) == ',') {
            length++;
            if (word != ""){
                allWords.push();
                allWords[p] = word;
                p++;    
            }
            word = "";
            useComma = true;
        }
        else if (businessLogic.charAt(i) == ';') {
            length++;
            if (word != ""){
                allWords.push();
                allWords[p] = word;
                p++;    
            }
            word = "";
            useSemiColon = true;
        }
        else if (businessLogic.charAt(i) == ')') {
            length++;
            if (word != ""){
                allWords.push();
                allWords[p] = word;
                p++;    
            }
            word = "";
            useParentheses = true;
        }
        else if (businessLogic.charAt(i) == '(') {
            length++;
            if (word != ""){
                allWords.push();
                allWords[p] = word;
                p++;    
            }
            word = "";
        }
        else if (businessLogic.charAt(i) == ':') {
            length++;
            if (word != ""){
                allWords.push();
                allWords[p] = word;
                p++;    
            }
            word = "";
            useColon = true;
        }
        else
            word = word + businessLogic.charAt(i);
    }

    if (unique) {
        if (useColon) {
            vocabulary ++;
        }
        if (useComma) {
            vocabulary ++;
        }
        if (useParentheses) {
            vocabulary ++;
        }
        if (useParentheses) {
            vocabulary ++;
        }
        if (useSemiColon) {
            vocabulary ++;
        }
        if (useSpace) {
            vocabulary ++;
        }
        //list = list.filter((x, i, a) => a.indexOf(x) == i)
        allWords.filter((x, i, a) => a.indexOf(x) == i);
        var distinctWords: string[] = [];       
        for(var i=0;i<allWords.length;i++) {
            var str=allWords[i];
            if(distinctWords.indexOf(str)==-1) {
                distinctWords.push(str);
            }
        }
        vocabulary = vocabulary + distinctWords.length;
        return vocabulary;
    } 
    else {
        return length;        
    }
}

function validProcedureName(value : string) :boolean {
    if (value.startsWith('PROCEDURE')) {
        return(true);
    }
    if (value.startsWith('LOCAL PROCEDURE')) {
        return(true);
    }
    if (value.startsWith('TRIGGER')) {
        return(true);
    }
    return false;
}