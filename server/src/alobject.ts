import { alFunction } from './alfunction';
import { alVariable } from "./alvariable";
import { alField } from "./alfield";
import { alLine } from './alLine';

export class alObject {
    content: string;
    alField: alField[];
    alVariable: alVariable[];
    alFunction: alFunction[];
    alLine: alLine[];
    numberOfFunctions: number = 0;
    objectType: alObjectType;
    objectID: number;
    maintainabilityIndex: number = 171;
    name: string;
    lastLineNumber: number;
    hungariannotationoptions: string;
    hasDrillDownPageId: boolean = false;
    hasLookupPageId: boolean = false;
    constructor(theText: string, newHungariannotationoptions: string) {
        this.content = theText;
        this.alFunction = [];
        this.alVariable = [];
        this.alField = [];
        this.alLine = [];
        var p: number = 0;
        var n: number = 0;
        var f: number = 0;
        var functionContent: string = "";
        var startsAt: number = 0;
        var firstTime: boolean = false;
        var inVariableSection: boolean = false;
        var inFieldsSection: boolean = false;
        var inFunction: boolean = false;
        var beginEnd: number = 0;
        var hungariannotationoptions = newHungariannotationoptions;

        let lines = this.content.split(/\r?\n/g);

        lines.forEach((line, i) => {
            this.alLine.push();
            this.alLine[i] = new alLine(line);

            if (i == 0) {
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
            if (validProcedureName(line)) {
                inFunction = true;
                inFieldsSection = false;
                inVariableSection = false;
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

            }
            if (line.trim().toUpperCase() == 'BEGIN') {
                beginEnd += 1;
            }
            if (line.trim().toUpperCase() == 'END;') {
                beginEnd -= 1;
                if (beginEnd == 0) {
                    inFunction = false;
                }
            }
            this.alLine[i].isCode = beginEnd >= 1;
            if (firstTime) {
                functionContent = functionContent + line + '\n';
                if (line == '}') {
                    this.lastLineNumber = i;
                }
            }
            if ((inVariableSection) && (i > 1)) {
                if (line.indexOf(':') != -1) {
                    this.alVariable[n] = new alVariable(line.toUpperCase(), i + 1, true);
                    n++;
                }
                else {
                    inVariableSection = false;
                }
            }
            if ((line.toUpperCase().trim() == ('VAR')) && (inFunction == false)) {
                inVariableSection = true;
            }
            if (line.toUpperCase().trim() == ('KEYS')) {
                inFieldsSection = false;
            }
            if ((inFieldsSection) && (i > 1)) {
                if (line.toUpperCase().indexOf('FIELD') != -1) {
                    this.alField[f] = new alField(line, i + 1, hungariannotationoptions);
                    f++;
                }
            }
            if (line.toUpperCase().trim() == ('FIELDS')) {
                inFieldsSection = true;
            }
            if (line.trim().toUpperCase().indexOf('DRILLDOWNPAGEID') != -1) {
                this.hasDrillDownPageId = true;
            }
            if (line.trim().toUpperCase().indexOf('LOOKUPPAGEID') != -1) {
                this.hasLookupPageId = true;
            }
        })

        // Also Fetch the last function
        this.alFunction.push();
        p++;
        this.alFunction[p] = new alFunction(functionContent, startsAt, lines.length);
        if (this.alFunction[p].maintainabilityIndex < this.maintainabilityIndex) {
            this.maintainabilityIndex = this.alFunction[p].maintainabilityIndex;
        }

        // Add LocalVariables for easier diagnostics
        this.alFunction.forEach(alFunction => {
            alFunction.alVariable.forEach((alVariable) => {
                this.alLine.forEach((alLine, i) => {
                    if ((i >= alFunction.startsAtLineNo) && (i <= alFunction.endsAtLineNo) && (alLine.isCode) && (alVariable.isUsed == false)) {
                        alVariable.isUsed = alLine.upperCase.indexOf(alVariable.name) >= 0;
                        //                        var test : number = alLine.upperCase.indexOf(alVariable.name);
                    };
                })
                this.alVariable[n] = alVariable;
                n++;
            })
        });

        this.objectType = getObjectType(this.content);
        this.numberOfFunctions = this.alFunction.length;
    }
    getContent() {
        return this.content;
    }
    getNumberOfFunctions() {
        return this.content.split("PROCEDURE ").length - 1;
    }
    getSummary(): alSummary {
        let mySummary = new alSummary(this);
        return (mySummary);
    }
}

class alSummary {
    content: string;
    constructor(alObject: alObject) {
        this.content = alObject.name;
    }
}

export const enum alObjectType {
    table = 1,
    page = 2,
    report = 3,
    codeunit = 4,
    query = 5,
    xmlport = 6,
    menusuite = 7
}

function validProcedureName(value: string): boolean {
    if (value.trim().toUpperCase().startsWith('PROCEDURE')) {
        return (true);
    }
    if (value.trim().toUpperCase().startsWith('LOCAL PROCEDURE')) {
        return (true);
    }
    if (value.trim().toUpperCase().startsWith('TRIGGER')) {
        return (true);
    }
    return false;
}

function getObjectType(str: string) {
    switch (getCharsBefore(str.toUpperCase(), " ")) {
        case "TABLE":
            return (1);
        case "CODEUNIT":
            return (4);

    }
    return (0);
}

function getCharsBefore(str: string, chr: string) {
    var index = str.indexOf(chr);
    if (index != -1) {
        return (str.substring(0, index));
    }
    return ("");
}

