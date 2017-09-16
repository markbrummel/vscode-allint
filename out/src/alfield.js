'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const hungariannotation_1 = require("./hungariannotation");
class alField {
    constructor(content, startsAt) {
        this.isHungarianNotation = false;
        this.content = content.trim();
        this.lineNumber = startsAt;
        let values = this.content.split(';');
        values.forEach((value, i) => {
            if (i == 0) {
                this.id = value.toUpperCase().replace('FIELD(', '');
            }
            if (i == 1) {
                this.name = value.replace(/"/, '');
                this.name = this.name.replace(/"/, '');
            }
            if (i == 2) {
                this.type = value.replace(')', '');
            }
        });
        let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));
        if (config.checkhungariannotation) {
            let hungarianOptions = new hungariannotation_1.alHungarianOptions(config.hungariannotationoptions);
            hungarianOptions.alHungarianOption.forEach(hungarianOption => {
                if ((hungarianOption.alType == 'FIELD') && (this.isHungarianNotation == false)) {
                    this.isHungarianNotation = (this.name.toUpperCase().indexOf(hungarianOption.abbreviation) != -1);
                }
            });
        }
    }
}
exports.alField = alField;
//# sourceMappingURL=alfield.js.map