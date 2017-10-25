'use strict';
//import { Range, DiagnosticSeverity, Diagnostic } from "vscode";
import { alObject, alObjectType } from './alobject';
import { alVariable } from "./alvariable";
import { alFunction } from "./alfunction";
import { isReserved } from "./reservedwords";
import { alField } from "./alfield";
import { DiagnosticSeverity } from 'vscode-languageserver/lib/main';

export function checkForCommit(line: string, diagnostics: any, i: number) {
    let index = line.toUpperCase().indexOf('COMMIT');
    if (index >= 0) {
        diagnostics.push({
            severity: DiagnosticSeverity.Warning,
            range: {
                start: { line: i, character: index },
                end: { line: i, character: index + 5 }
            },
            message: `A ${line.substr(index, 5)} is an indication of poorly structured code (NAV-Skills Clean Code)`,
            source: 'AlLint'
        });
    }
}

export function checkForWithInTableAndPage(line: string, diagnostics: any, myObject: alObject, i: number) {
    if (myObject.objectType == alObjectType.table || myObject.objectType == alObjectType.page) {
        let index = line.toUpperCase().indexOf('WITH ');
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + 4 }
                },
                message: `A ${line.substr(index, 4)} should not be used in a table or page object (NAV-Skills Clean Code)`,
                source: 'AlLint'
            });
        }
    }
}

export function checkForMissingDrillDownPageId(diagnostics: any, myObject: alObject) {
    if (myObject.objectType == alObjectType.table && !myObject.hasDrillDownPageId) {
        diagnostics.push({
            severity: DiagnosticSeverity.Warning,
            range: {
                start: { line: 0, character: 0 },
                end: { line: 0, character: 5 }
            },
            message: `DrillDownPageID should be in a table (NAV-Skills Clean Code)`,
            source: 'AlLint'
        });
    }
}

export function checkForMissingLookupPageId(diagnostics: any, myObject: alObject) {
    if (myObject.objectType == alObjectType.table && !myObject.hasLookupPageId) {
        diagnostics.push({
            severity: DiagnosticSeverity.Warning,
            range: {
                start: { line: 0, character: 0 },
                end: { line: 0, character: 5 }
            },
            message: `LookupPageID should be set in a table (NAV-Skills Clean Code)`,
            source: 'AlLint'            
        });
    }
}

export function checkFunctionForHungarianNotation(alFunction: alFunction, line: string, diagnostics: any, i: number) {
    if (alFunction.isHungarianNotation) {
        let index = line.indexOf(alFunction.name);
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + alFunction.name.length }
                },
                message: `${line.substr(index, alVariable.name.length)} has Hungarian Notation (NAV-Skills Clean Code)`,
                source: 'AlLint'
            });
        }
    }
}

export function checkFunctionReservedWord(alFunction: alFunction, line: string, diagnostics: any, i: number) {
    if (isReserved(alFunction.name.toUpperCase())) {
        let index = line.indexOf(alFunction.name);
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + alFunction.name.length }
                },
                message: `${line.substr(index, alFunction.name.length)} is a reserved word (NAV-Skills Clean Code)`,
                source: 'AlLint'
            });
        }
    }
}

export function checkVariableForHungarianNotation(alVariable: alVariable, line: string, diagnostics: any, i: number) {
    if ((alVariable.isHungarianNotation)) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + alVariable.name.length }
                },
                message: `${line.substr(index, alVariable.name.length)} has Hungarian Notation (NAV-Skills Clean Code)`,
                source: 'AlLint'
            });
        }
    }
}

export function checkVariableForIntegerDeclaration(alVariable: alVariable, line: string, diagnostics: any, i: number) {
    if ((alVariable.objectIdIsANumber) && (alVariable.type == 'Record')) {
        let index = line.toUpperCase().indexOf(alVariable.objectId);
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + alVariable.name.length }
                },
                message: `Objects should be declared by name, not by number (NAV-Skills Clean Code)`,
                source: 'AlLint'
            });
        }
    }
}

export function checkVariableForTemporary(alVariable: alVariable, line: string, diagnostics: any, i: number) {
    if ((alVariable.isTemporary) && (alVariable.hasWrongTempName())) {
        let index = line.toUpperCase().indexOf(alVariable.objectId);
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + alVariable.name.length }
                },
                message: `Temporary variables should be named TEMP, BUFFER, ARGS or ARGUMENTS as prefix or suffix (NAV-Skills Clean Code)`,
                source: 'AlLint'
            });
        }
    }
}

export function checkVariableForTextConst(alVariable: alVariable, line: string, diagnostics: any, i: number) {
    if (alVariable.hasWrongTextConstName()) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + alVariable.name.length }
                },
                message: `Text Constants should be declared with a readable name (NAV-Skills Clean Code)`,
                source: 'AlLint'
            });
        }
    }
}

export function checkVariableForReservedWords(alVariable: alVariable, line: string, diagnostics: any, i: number) {
    if (isReserved(alVariable.name.toUpperCase())) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + alVariable.name.length }
                },
                message: `${line.substr(index, alVariable.name.length)} is a reserved word (NAV-Skills Clean Code)`,
                source: 'AlLint'
            });
        }
    }
}

export function checkVariableUnUsed(alVariable: alVariable, line: string, diagnostics: any, i: number) {
    if (alVariable.isUsed == false) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + alVariable.name.length }
                },
                message: `${line.substr(index, alVariable.name.length)} is a unused variable (NAV-Skills Clean Code)`,
                source: 'AlLint'
            });
        }
    }
}

export function checkVariableAlreadyUsed(alObject: alObject, alVariable: alVariable, line: string, diagnostics: any, i: number) {
    if (alVariable.alsoExistAsGlobalOrLocal(alObject)) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + alVariable.name.length }
                },
                message: `${line.substr(index, alVariable.name.length)} is declared both as global and local (NAV-Skills Clean Code)`,
                source: 'AlLint'
            });
        }
    }
}

export function checkFieldForHungarianNotation(alField: alField, line: string, diagnostics: any, i: number) {
    if (alField.isHungarianNotation) {
        let index = line.indexOf(alField.name);
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + alField.name.length }
                },
                message: `${line.substr(index, alVariable.name.length)} has Hungarian Notation (NAV-Skills Clean Code)`,
                source: 'AlLint'
            });
        }
    }
}
export function checkVariableNameForUnderScore(alVariable: alVariable, line: string, diagnostics: any, i: number) {
    if (alVariable.nameContainsSpecialCharacters) {
        let index = line.toUpperCase().indexOf(alVariable.name);
        if (index >= 0) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + alVariable.name.length }
                },
                message: `Variable names should not contain special characters or whitespaces in their name (NAV-Skills Clean Code)`,
                source: 'AlLint',
                code : 'Rename'
            });
        }
    }
}
