'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
const open = require('opn');
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
            let myObject = new alObject(editor);
            getDiagnostics(editor, myObject);
            let maintainabilityIndex = myObject.getMaintainabilityIndex(editor.document.lineAt(editor.selection.active.line));
            let cyclomaticComplexity = myObject.getCyclomaticComplexity(editor.document.lineAt(editor.selection.active.line));
            var currentFunctionName = myObject.getCurrentFunction(editor.document.lineAt(editor.selection.active.line));
            var theText = currentFunctionName + ` Maintainability Index ${maintainabilityIndex}` + ` cc ${cyclomaticComplexity}` + ` functions : ${myObject.numberOfFunctions}`;
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
        let myObject = new alObject(editor);
        getDiagnostics(editor, myObject);
        //        let workspace.rootPath:string;
        var htmlURL = "file:///C:/Users/markb/vscode-allint/allint.html?ddd3=mark";
        open(htmlURL);
        vscode_1.window.showInformationMessage(htmlURL);
        vscode_1.window.showInformationMessage(JSON.stringify(myObject.getSummary));
    }
}
class alObject {
    constructor(theText) {
        this.content = theText.document.getText(new vscode_1.Range(0, 0, 1000, 1000));
        this.test = ["0", "1"];
        this.alFunction = [];
        this.maintainabilityIndex = 171;
        this.numberOfFunctions = 0;
        var p = 0;
        var functionContent = "";
        var startsAt = 0;
        var firstTime = false;
        let lines = this.content.split(/\r?\n/g);
        lines.forEach((line, i) => {
            if (i == 0) {
                let objectDetails = line.split(' ');
                objectDetails.forEach((part, n) => {
                    if (n == 2) {
                        //this.objectID = part;
                    }
                    if (n == 3) {
                        this.name = part;
                    }
                });
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
        });
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
    }
    getNumberOfFunctions() {
        return this.content.split("PROCEDURE ").length - 1;
    }
    getCurrentFunction(line) {
        var currentFuctionName = "Not in function";
        this.alFunction.forEach(element => {
            if ((element.startsAtLineNo < line.lineNumber) && (element.endsAtLineNo > line.lineNumber)) {
                currentFuctionName = element.name;
            }
        });
        return (currentFuctionName);
    }
    getMaintainabilityIndex(line) {
        var currentMaintainabilityIndex = 0;
        this.alFunction.forEach(element => {
            if ((element.startsAtLineNo < line.lineNumber) && (element.endsAtLineNo > line.lineNumber)) {
                currentMaintainabilityIndex = element.maintainabilityIndex;
            }
        });
        return (currentMaintainabilityIndex);
    }
    getCyclomaticComplexity(line) {
        var currentCyclomaticComplexity = 0;
        this.alFunction.forEach(element => {
            if ((element.startsAtLineNo < line.lineNumber) && (element.endsAtLineNo > line.lineNumber)) {
                currentCyclomaticComplexity = element.cycolomaticComplexity;
            }
        });
        return (currentCyclomaticComplexity);
    }
    getSummary() {
        let mySummary = new alSummary(this);
        return (mySummary);
    }
}
class alFunction {
    constructor(content, startsAt, endsAt) {
        this.content = content.trim();
        this.startsAtLineNo = startsAt;
        this.endsAtLineNo = endsAt;
        this.contentUpperCase = this.content.toUpperCase();
        this.numberOfLines = 0; //this.content.split("\n").length;
        this.name = getCharsBefore(this.content, "(");
        let lines = this.content.toUpperCase().split(/\r?\n/g);
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
                variables.forEach((variable, n) => {
                    this.alVariable.push();
                    this.alVariable[p] = new alVariable(variable, i + startsAt);
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
        });
        this.length = getHalstead(this.businessLogic, false);
        this.vocabulary = getHalstead(this.businessLogic, true);
        this.cycolomaticComplexity = (this.contentUpperCase.split("IF ").length - 1) +
            (this.contentUpperCase.split("CASE ").length - 1) + (this.contentUpperCase.split("ELSE ").length - 1);
        this.halsteadVolume = this.length * Math.log2(this.vocabulary);
        this.maintainabilityIndex = Math.round(Math.max(0, (171 - 5.2 * Math.log(this.halsteadVolume) - 0.23 * (this.cycolomaticComplexity) - 16.2 * Math.log(this.numberOfLines)) * 100 / 171));
    }
}
class alVariable {
    constructor(value, lineNo) {
        this.content = value.trim().replace(';', '').replace(')', '');
        this.lineNumber = lineNo;
        this.isHungarianNotation = true;
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
class alSummary {
    constructor(alObject) {
        this.content = alObject.name;
    }
}
function getDiagnostics(editor, myObject) {
    let diagnostics = [];
    let lines = editor.document.getText().split(/\r?\n/g);
    lines.forEach((line, i) => {
        let index = line.indexOf('COMMIT');
        if (index >= 0) {
            let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + 10)), 'Commit is dangerous and should be avoided (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
            diagnostics.push(myDiagnose);
        }
        myObject.alFunction.forEach(element => {
            element.alVariable.forEach(element => {
                if ((element.isHungarianNotation) && (element.lineNumber == i + 1)) {
                    let index = line.toUpperCase().indexOf(element.name);
                    let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + element.name.length)), 'Hungarian Notation Detected (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
                    diagnostics.push(myDiagnose);
                }
            });
        });
    });
    let alDiagnostics = vscode_1.languages.createDiagnosticCollection("alDiagnostics");
    alDiagnostics.set(editor.document.uri, diagnostics);
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
function getHalstead(businessLogic, unique) {
    var vocabulary = 0;
    var length = 0;
    var word = "";
    var allWords = [];
    var p = 0;
    var useSpace = false;
    var usePeriod = false;
    var useComma = false;
    var useColon = false;
    var useSemiColon = false;
    var useParentheses = false;
    // To Do : String is one operator
    for (var i = 0; i < businessLogic.length; i++) {
        if (businessLogic.charAt(i) == ' ') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
            useSpace = true;
        }
        else if (businessLogic.charAt(i) == '.') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
            usePeriod = true;
        }
        else if (businessLogic.charAt(i) == ',') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
            useComma = true;
        }
        else if (businessLogic.charAt(i) == ';') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
            useSemiColon = true;
        }
        else if (businessLogic.charAt(i) == ')') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
            useParentheses = true;
        }
        else if (businessLogic.charAt(i) == '(') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
        }
        else if (businessLogic.charAt(i) == ':') {
            length++;
            if (word != "") {
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
            vocabulary++;
        }
        if (useComma) {
            vocabulary++;
        }
        if (useParentheses) {
            vocabulary++;
        }
        if (useParentheses) {
            vocabulary++;
        }
        if (useSemiColon) {
            vocabulary++;
        }
        if (useSpace) {
            vocabulary++;
        }
        //list = list.filter((x, i, a) => a.indexOf(x) == i)
        allWords.filter((x, i, a) => a.indexOf(x) == i);
        var distinctWords = [];
        for (var i = 0; i < allWords.length; i++) {
            var str = allWords[i];
            if (distinctWords.indexOf(str) == -1) {
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
function validProcedureName(value) {
    if (value.startsWith('PROCEDURE')) {
        return (true);
    }
    if (value.startsWith('LOCAL PROCEDURE')) {
        return (true);
    }
    if (value.startsWith('TRIGGER')) {
        return (true);
    }
    return false;
}
//# sourceMappingURL=extension.js.map