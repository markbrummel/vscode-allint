'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
const reservedwords_1 = require("./reservedwords");
function getDiagnostics(editor, myObject) {
    let diagnostics = [];
    let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));
    //    myObject.alLine.forEach((alLine, i) => {
    //
    //    })
    let lines = editor.document.getText().split(/\r?\n/g);
    lines.forEach((line, i) => {
        if (myObject.alLine[i].isCode) {
            checkForCommit(line.toUpperCase(), config, diagnostics, i);
            checkForWithInTableAndPage(line.toUpperCase(), config, diagnostics, myObject, i);
        }
        myObject.alFunction.forEach(alFunction => {
            if (alFunction.startsAtLineNo == i + 1) {
                checkFunctionForHungarianNotation(alFunction, line, diagnostics, i);
                checkFunctionReservedWord(alFunction, line, diagnostics, i);
            }
        });
        myObject.alField.forEach(alField => {
            if (alField.lineNumber == i + 1) {
                checkFieldForHungarianNotation(alField, line, diagnostics, i);
            }
        });
        myObject.alVariable.forEach(alVariable => {
            if (alVariable.lineNumber == i + 1) {
                checkVariableForHungarianNotation(alVariable, line, diagnostics, i);
                checkVariableForIntegerDeclaration(alVariable, line, diagnostics, i);
                checkVariableForTemporary(alVariable, line, diagnostics, i);
                checkVariableForTextConst(alVariable, line, diagnostics, i);
                checkVariableForReservedWords(alVariable, line, diagnostics, i);
                checkVariableUnUsed(alVariable, line, diagnostics, i);
                checkVariableAlreadyUsed(myObject, alVariable, line, diagnostics, i);
                checkVariableNameForUnderScore(alVariable, line, config, diagnostics, i);
            }
        });
    });
    let alDiagnostics = vscode_1.languages.createDiagnosticCollection("alDiagnostics");
    alDiagnostics.set(editor.document.uri, diagnostics);
}
exports.getDiagnostics = getDiagnostics;
function checkForCommit(line, config, diagnostics, i) {
    var position = line.toUpperCase().indexOf('COMMIT');
    if ((position >= 0) && (config.checkcommit)) {
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, position), new vscode.Position(i, position + 10)), 'A COMMIT is an indication of poorly structured code (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
function checkForWithInTableAndPage(line, config, diagnostics, myObject, i) {
    if (myObject.objectType == 1) {
        if ((line.indexOf('WITH ') >= 0) && (config.checkcommit)) {
            let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, line.indexOf('WITH ')), new vscode.Position(i, line.indexOf('WITH ') + 4)), 'A WITH should not be used in a table or page object (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
            diagnostics.push(myDiagnose);
        }
    }
}
function checkFunctionForHungarianNotation(alFunction, line, diagnostics, i) {
    if (alFunction.isHungarianNotation) {
        let index = line.indexOf(alFunction.name);
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + alFunction.name.length)), 'Hungarian Notation (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
function checkFunctionReservedWord(alFunction, line, diagnostics, i) {
    if (reservedwords_1.isReserved(alFunction.name.toUpperCase())) {
        let index = line.indexOf(alFunction.name);
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + alFunction.name.length)), 'This is a reserved word (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
function checkVariableForHungarianNotation(alVariable, line, diagnostics, i) {
    if ((alVariable.isHungarianNotation)) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)), 'Hungarian Notation (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
function checkVariableForIntegerDeclaration(alVariable, line, diagnostics, i) {
    if ((alVariable.objectIdIsANumber) && (alVariable.type == 'Record')) {
        let index = line.toUpperCase().indexOf(alVariable.objectId);
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)), 'Objects should be declared by name, not by number (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
function checkVariableForTemporary(alVariable, line, diagnostics, i) {
    if ((alVariable.isTemporary) && (alVariable.hasWrongTempName())) {
        let index = line.toUpperCase().indexOf(alVariable.objectId);
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)), 'Temporary variables should be named TEMP, BUFFER, ARGS or ARGUMENTS as prefix or suffix (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
function checkVariableForTextConst(alVariable, line, diagnostics, i) {
    if (alVariable.hasWrongTextConstName()) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)), 'Text Constants should be declared with a readable name (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
function checkVariableForReservedWords(alVariable, line, diagnostics, i) {
    if (reservedwords_1.isReserved(alVariable.name.toUpperCase())) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)), 'This is a reserved word (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
function checkVariableUnUsed(alVariable, line, diagnostics, i) {
    if (alVariable.isUsed == false) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)), 'Unused Variable (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
function checkVariableAlreadyUsed(alObject, alVariable, line, diagnostics, i) {
    if (alVariable.alsoExistAsGlobalOrLocal(alObject)) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)), 'This Variable is declared both as global and local (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
function checkFieldForHungarianNotation(alField, line, diagnostics, i) {
    if (alField.isHungarianNotation) {
        let index = line.indexOf(alField.name);
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + alField.name.length)), 'Hungarian Notation (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
function checkVariableNameForUnderScore(alVariable, line, config, diagnostics, i) {
    if (config.checkspecialcharactersinvariablenames && alVariable.nameContainsSpecialCharacters) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        let myDiagnose = new vscode_1.Diagnostic(new vscode_1.Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)), 'Variable names should not contain special characters or whitespaces in their name (NAV-Skills Clean Code)', vscode_1.DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}
//# sourceMappingURL=diagnostics.js.map