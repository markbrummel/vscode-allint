import { alVariable } from './alvariable';
import { getHalstead } from './halstead';
import { alHungarianOptions } from "./hungariannotation";

export class alFunction {
    content: string;
    contentUpperCase: string;
    name: string;
    alVariable: alVariable[];
    numberOfLines: number;
    cycolomaticComplexity: number;
    maintainabilityIndex: number;
    distinctOperators: number;
    distinctOperands: number;
    numberOfOperators: number;
    numberOfOperands: number;
    vocabulary: number;
    length: number;
    halsteadVolume: number;
    returnValue: string;
    businessLogic: string;
    startsAtLineNo: number;
    endsAtLineNo: number;
    isHungarianNotation: boolean = false;
    isLocal: boolean;
    isTrigger: boolean;
    constructor(content: string, startsAt: number, endsAt: number) {
        this.content = content.trim();
        this.startsAtLineNo = startsAt;
        this.endsAtLineNo = endsAt;
        this.contentUpperCase = this.content.toUpperCase();
        this.numberOfLines = 0;
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
        this.name = this.name.trim();
        let lines = this.content.toUpperCase().split(/\r?\n/g);

        var inCodeSection: boolean = false;
        var inVariableSection: boolean = false;
        this.alVariable = [];
        this.businessLogic = "";
        var p: number = 0;

        // Get Variables
        lines.forEach((line, i) => {
            // Parameters
            if ((i == 0) && (line.indexOf('()') == -1)) {
                var variableString: string = line.substring(line.indexOf('('));
                if (variableString.endsWith(');')) { // Void
                    variableString = variableString.substring(1, variableString.length - 1);
                }
                else { // Return Value
                    this.returnValue = variableString.substring(variableString.indexOf(')'))
                    variableString = variableString.substring(1, variableString.length - this.returnValue.length);
                    this.returnValue.replace(':', '').replace(';', '');
                }
                let variables = variableString.split(';');
                variables.forEach((variable) => {
                    this.alVariable.push();
                    this.alVariable[p] = new alVariable(variable, i + startsAt, false);
                    this.alVariable[p].local = true;
                    this.alVariable[p].isParameter = true;
                    p++;
                })
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
                this.alVariable[p] = new alVariable(line, i + startsAt, false);
                p++;
            }
        })

        this.length = getHalstead(this.businessLogic, false);
        this.vocabulary = getHalstead(this.businessLogic, true);

        this.cycolomaticComplexity = (this.contentUpperCase.split("IF ").length - 1) +
            (this.contentUpperCase.split("CASE ").length - 1) + (this.contentUpperCase.split("ELSE ").length - 1);

        this.halsteadVolume = this.length * Math.log2(this.vocabulary);
        this.maintainabilityIndex = Math.round(Math.max(0, (171 - 5.2 * Math.log(this.halsteadVolume) - 0.23 * (this.cycolomaticComplexity) - 16.2 * Math.log(this.numberOfLines)) * 100 / 171));
        let hungarianOptions = new alHungarianOptions('Rec');

        hungarianOptions.alHungarianOption.forEach(hungarianOption => {
            if ((hungarianOption.alType == 'FUNCTION') && (this.isHungarianNotation == false)) {
                this.isHungarianNotation = (this.name.toUpperCase().indexOf(hungarianOption.abbreviation) != -1);
            }
        });
    }
}

function getCharsBefore(str: string, chr: string) {
    var index = str.indexOf(chr);
    if (index != -1) {
        return (str.substring(0, index));
    }
    return ("");
}
