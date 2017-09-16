"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const alvariable_1 = require("./alvariable");
const halstead_1 = require("./halstead");
const hungariannotation_1 = require("./hungariannotation");
class alFunction {
    constructor(content, startsAt, endsAt) {
        this.isHungarianNotation = false;
        this.content = content.trim();
        this.startsAtLineNo = startsAt;
        this.endsAtLineNo = endsAt;
        this.contentUpperCase = this.content.toUpperCase();
        this.numberOfLines = 0;
        this.name = getCharsBefore(this.content, "(");
        this.isLocal = this.name.toUpperCase().startsWith('LOCAL');
        this.isTrigger = this.name.toUpperCase().startsWith('TRIGGER');
        if (this.isTrigger) {
            this.name = this.name.substring(8);
        }
        else if (this.isLocal) {
            this.name = this.name.substring(16);
        }
        else {
            this.name = this.name.substring(10);
        }
        this.name = this.name.trim();
        let lines = this.content.toUpperCase().split(/\r?\n/g);
        var inCodeSection = false;
        var inVariableSection = false;
        this.alVariable = [];
        this.businessLogic = "";
        var p = 0;
        // Get Variables
        lines.forEach((line, i) => {
            // Parameters
            if ((i == 0) && (line.indexOf('()') == -1)) {
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
                    this.alVariable[p] = new alvariable_1.alVariable(variable, i + startsAt, false);
                    this.alVariable[p].local = true;
                    this.alVariable[p].isParameter = true;
                    p++;
                });
                // breaddownProcedureVariables(line);
            }
            // Local variables
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
                this.alVariable[p] = new alvariable_1.alVariable(line, i + startsAt, false);
                p++;
            }
        });
        this.length = halstead_1.getHalstead(this.businessLogic, false);
        this.vocabulary = halstead_1.getHalstead(this.businessLogic, true);
        this.cycolomaticComplexity = (this.contentUpperCase.split("IF ").length - 1) +
            (this.contentUpperCase.split("CASE ").length - 1) + (this.contentUpperCase.split("ELSE ").length - 1);
        this.halsteadVolume = this.length * Math.log2(this.vocabulary);
        this.maintainabilityIndex = Math.round(Math.max(0, (171 - 5.2 * Math.log(this.halsteadVolume) - 0.23 * (this.cycolomaticComplexity) - 16.2 * Math.log(this.numberOfLines)) * 100 / 171));
        let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));
        if (config.checkhungariannotation) {
            let hungarianOptions = new hungariannotation_1.alHungarianOptions(config.hungariannotationoptions);
            hungarianOptions.alHungarianOption.forEach(hungarianOption => {
                if ((hungarianOption.alType == 'FUNCTION') && (this.isHungarianNotation == false)) {
                    this.isHungarianNotation = (this.name.toUpperCase().indexOf(hungarianOption.abbreviation) != -1);
                }
            });
        }
    }
}
exports.alFunction = alFunction;
function getCharsBefore(str, chr) {
    var index = str.indexOf(chr);
    if (index != -1) {
        return (str.substring(0, index));
    }
    return ("");
}
//# sourceMappingURL=alfunction.js.map