"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const alfunction_1 = require("./alfunction");
const alvariable_1 = require("./alvariable");
const alfield_1 = require("./alfield");
class alObject {
    constructor(theText) {
        this.numberOfFunctions = 0;
        this.maintainabilityIndex = 171;
        this.content = theText.document.getText(new vscode_1.Range(0, 0, 1000, 1000));
        this.alFunction = [];
        this.alVariable = [];
        this.alField = [];
        var p = 0;
        var n = 0;
        var f = 0;
        var functionContent = "";
        var startsAt = 0;
        var firstTime = false;
        var inVariableSection = false;
        var inFieldsSection = false;
        let lines = this.content.split(/\r?\n/g);
        //this.alFunction = getFunctions(lines);
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
                inFieldsSection = false;
                inVariableSection = false;
                if (firstTime == true) {
                    this.alFunction.push();
                    p++;
                    this.alFunction[p] = new alfunction_1.alFunction(functionContent, startsAt, i);
                    if (this.alFunction[p].maintainabilityIndex < this.maintainabilityIndex) {
                        this.maintainabilityIndex = this.alFunction[p].maintainabilityIndex;
                    }
                    functionContent = "";
                }
                firstTime = true;
                startsAt = i + 1;
            }
            if (firstTime) {
                functionContent = functionContent + line + '\n';
                if (line == '}') {
                    this.lastLineNumber = i;
                }
            }
            if ((inVariableSection) && (i > 1)) {
                if (line.indexOf(':') != -1) {
                    this.alVariable[n] = new alvariable_1.alVariable(line.toUpperCase(), i + 1, true);
                    n++;
                }
                else {
                    inVariableSection = false;
                }
            }
            if ((line.toUpperCase().trim() == ('VAR')) && (this.alFunction.length == 0)) {
                inVariableSection = true;
            }
            if (line.toUpperCase().trim() == ('KEYS')) {
                inFieldsSection = false;
            }
            if ((inFieldsSection) && (i > 1)) {
                if (line.toUpperCase().indexOf('FIELD') != -1) {
                    this.alField[f] = new alfield_1.alField(line, i + 1);
                    f++;
                }
            }
            if (line.toUpperCase().trim() == ('FIELDS')) {
                inFieldsSection = true;
            }
        });
        // Also Fetch the last function
        this.alFunction.push();
        p++;
        this.alFunction[p] = new alfunction_1.alFunction(functionContent, startsAt, lines.length);
        if (this.alFunction[p].maintainabilityIndex < this.maintainabilityIndex) {
            this.maintainabilityIndex = this.alFunction[p].maintainabilityIndex;
        }
        // Add LocalVariables for easier diagnostics
        this.alFunction.forEach(alFunction => {
            alFunction.alVariable.forEach((alVariable, i) => {
                this.alVariable[n] = alVariable;
                n++;
            });
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
exports.alObject = alObject;
class alSummary {
    constructor(alObject) {
        this.content = alObject.name;
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
function getObjectType(str) {
    switch (getCharsBefore(str.toUpperCase(), " ")) {
        case "TABLE":
            return (1);
        case "CODEUNIT":
            return (4);
    }
    return (0);
}
function getCharsBefore(str, chr) {
    var index = str.indexOf(chr);
    if (index != -1) {
        return (str.substring(0, index));
    }
    return ("");
}
function getFunctions(string) {
    var alFunction;
    return alFunction;
}
//# sourceMappingURL=alobject.js.map