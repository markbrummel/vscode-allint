'use strict';
import * as vscode from 'vscode';
import { TextLine, TextEditor, commands, window, ExtensionContext, Range, Position, StatusBarItem, StatusBarAlignment, TextDocument, Disposable, DiagnosticSeverity, Diagnostic, languages } from "vscode";
import { alObject } from './alobject';
import { alVariable } from "./alvariable";
import { alFunction } from "./alfunction";
import { isReserved } from "./reservedwords";
import { alField } from "./alfield";

export function getDiagnostics(editor : TextEditor, myObject : alObject) {
    let diagnostics: Diagnostic[] = [];
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
                checkVariableAlreadyUsed(myObject ,alVariable, line, diagnostics, i);  
                checkVariableNameForUnderScore(alVariable, line, config, diagnostics, i);
            }
        });        
    })

    let alDiagnostics = languages.createDiagnosticCollection("alDiagnostics");
    alDiagnostics.set(editor.document.uri, diagnostics);
}

function checkForCommit(line : string, config : any, diagnostics : any, i : number) {
    var position = line.toUpperCase().indexOf('COMMIT');
    if ((position >= 0) && (config.checkcommit)) {
        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, position), new vscode.Position(i, position + 10)),
            'A COMMIT is an indication of poorly structured code (NAV-Skills Clean Code)',
            DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }
}

function checkForWithInTableAndPage(line : string, config : any, diagnostics : any, myObject : alObject, i : number) {
    if (myObject.objectType == 1) {
        if ((line.indexOf('WITH ') >= 0) && (config.checkcommit)) {
            let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, line.indexOf('WITH ')), new vscode.Position(i, line.indexOf('WITH ') + 4)),
                'A WITH should not be used in a table or page object (NAV-Skills Clean Code)',
                DiagnosticSeverity.Information);
            diagnostics.push(myDiagnose);
        }    
    }
}

function checkFunctionForHungarianNotation(alFunction : alFunction, line : string, diagnostics : any, i : number) {
    if (alFunction.isHungarianNotation) {
        let index = line.indexOf(alFunction.name);
        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alFunction.name.length)),
        'Hungarian Notation (NAV-Skills Clean Code)',
        DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);                    
    }

}

function checkFunctionReservedWord(alFunction : alFunction, line : string, diagnostics : any, i : number) {
    if (isReserved(alFunction.name.toUpperCase())) {
        let index = line.indexOf(alFunction.name);
        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alFunction.name.length)),
        'This is a reserved word (NAV-Skills Clean Code)',
        DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);                    
    }
}

function checkVariableForHungarianNotation(alVariable : alVariable, line : string, diagnostics : any, i : number) {
    if ((alVariable.isHungarianNotation)) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)),
        'Hungarian Notation (NAV-Skills Clean Code)',
        DiagnosticSeverity.Information);

        diagnostics.push(myDiagnose);             
    }
}

function checkVariableForIntegerDeclaration(alVariable : alVariable, line : string, diagnostics : any, i : number) {
    if ((alVariable.objectIdIsANumber) && (alVariable.type == 'Record')) {
        let index = line.toUpperCase().indexOf(alVariable.objectId);
        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)),
        'Objects should be declared by name, not by number (NAV-Skills Clean Code)',
        DiagnosticSeverity.Information);

        diagnostics.push(myDiagnose);
            
    }
}

function checkVariableForTemporary(alVariable : alVariable, line : string, diagnostics : any, i : number) {
    if ((alVariable.isTemporary) && (alVariable.hasWrongTempName())) {
        let index = line.toUpperCase().indexOf(alVariable.objectId);
        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)),
        'Temporary variables should be named TEMP, BUFFER, ARGS or ARGUMENTS as prefix or suffix (NAV-Skills Clean Code)',
        DiagnosticSeverity.Information);

        diagnostics.push(myDiagnose);                    
    }
}

function checkVariableForTextConst(alVariable : alVariable, line : string, diagnostics : any, i : number) {
    if (alVariable.hasWrongTextConstName()) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)),
        'Text Constants should be declared with a readable name (NAV-Skills Clean Code)',
        DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }    
}

function checkVariableForReservedWords(alVariable : alVariable, line : string, diagnostics : any, i : number) {
    if (isReserved(alVariable.name.toUpperCase())) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)),
        'This is a reserved word (NAV-Skills Clean Code)',
        DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }    
}

function checkVariableUnUsed(alVariable : alVariable, line : string, diagnostics : any, i : number) {
    if (alVariable.isUsed == false) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)),
        'Unused Variable (NAV-Skills Clean Code)',
        DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }    
}

function checkVariableAlreadyUsed(alObject : alObject, alVariable : alVariable, line : string, diagnostics : any, i : number) {
    if (alVariable.alsoExistAsGlobalOrLocal(alObject)) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)),
        'This Variable is declared both as global and local (NAV-Skills Clean Code)',
        DiagnosticSeverity.Information);
        diagnostics.push(myDiagnose);
    }    
}

function checkFieldForHungarianNotation(alField : alField, line : string, diagnostics : any, i : number) {
    if (alField.isHungarianNotation) {
        let index = line.indexOf(alField.name);
        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alField.name.length)),
        'Hungarian Notation (NAV-Skills Clean Code)',
        DiagnosticSeverity.Information);

        diagnostics.push(myDiagnose);             
    }
}
function checkVariableNameForUnderScore(alVariable : alVariable , line : string, config : any, diagnostics : any, i : number){
    if(config.checkunderscoreinvariablenames &&  alVariable.nameContainsUnderscore){
        let index = line.toUpperCase().indexOf(alVariable.name);

        let myDiagnose = new Diagnostic(new Range(new vscode.Position(i, index), new vscode.Position(i, index + alVariable.name.length)),
        'Variable names should not contain underscores in their name (NAV-Skills Clean Code)', DiagnosticSeverity.Information);

        diagnostics.push(myDiagnose); 
    }
}
