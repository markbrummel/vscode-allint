'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class alVariable {
    constructor(value, lineNo, setIsGlobal) {
        this.isHungarianNotation = false;
        this.isTemporary = false;
        this.isUsed = false;
        this.content = value.trim().replace(';', '').replace(')', '');
        this.isGlobal = setIsGlobal;
        this.isUsed = setIsGlobal;
        this.lineNumber = lineNo;
        if (this.content.startsWith('VAR')) {
            this.content = this.content.substring(4); // remove var
            this.byRef = true;
        }
        this.name = this.content.substring(0, this.content.indexOf(':') - 1);
        this.type = this.content.substring(this.content.indexOf(':') + 2);
        if (this.type.indexOf(' ') > 0) {
            this.objectId = this.type.substring(this.type.indexOf(' ') + 1);
            if (this.objectId.indexOf('TEMPORARY') != -1) {
                this.isTemporary = true;
                this.objectId = this.objectId.substring(0, this.objectId.indexOf(' '));
            }
            this.objectIdIsANumber = true;
            this.type = this.type.substring(0, this.type.indexOf(' '));
        }
        if (this.content.endsWith(']')) {
            this.length = this.content.substring(this.content.indexOf('[') + 1, this.content.indexOf(']'));
        }
        if (this.type == 'TEXTCONST') {
            this.textConst = this.objectId;
            this.objectId = null;
        }
        let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));
        if (config.checkhungariannotation) {
            let hungarianOptions = new alHungarianOptions(config.hungariannotationoptions);
            hungarianOptions.alHungarianOption.forEach(hungarianOption => {
                if ((hungarianOption.alType == this.type) && (this.isHungarianNotation == false)) {
                    if (isHungarianException(this.name) == false) {
                        this.isHungarianNotation = (this.name.indexOf(hungarianOption.abbreviation) != -1);
                    }
                }
            });
        }
    }
    hasWrongTempName() {
        if (this.isTemporary == false)
            return false;
        if (this.name.toUpperCase().indexOf('TEMP') == -1)
            if (this.name.toUpperCase().indexOf('ARGS') == -1)
                if (this.name.toUpperCase().indexOf('ARGUMENTS') == -1)
                    if (this.name.toUpperCase().indexOf('BUFFER') == -1) {
                        return true;
                    }
        return false;
    }
    hasWrongTextConstName() {
        if (this.type != 'TEXTCONST') {
            return false;
        }
        if (this.name.toUpperCase().startsWith('TEXT')) {
            return true;
        }
        return false;
    }
    alsoExistAsGlobalOrLocal(alObject) {
        var found = false;
        alObject.alVariable.forEach(alVariable => {
            if ((alVariable.name == this.name) && (alVariable.isGlobal != this.isGlobal)) {
                found = true;
            }
        });
        return found;
    }
}
exports.alVariable = alVariable;
class alHungarianOptions {
    constructor(value) {
        this.alHungarianOption = [];
        let hungariannotationoptions = value.split(';');
        hungariannotationoptions.forEach((hungariannotationoption, i) => {
            this.alHungarianOption.push();
            this.alHungarianOption[i] = new alHungarianOption(hungariannotationoption);
        });
    }
}
class alHungarianOption {
    constructor(value) {
        this.alType = value.substring(0, value.indexOf(',')).toUpperCase();
        this.abbreviation = value.substring(value.indexOf(',') + 1).toUpperCase();
    }
}
function isHungarianException(value) {
    if (value.toUpperCase() == 'REC') {
        return true;
    }
    if (value.toUpperCase() == 'XREC') {
        return true;
    }
    return false;
}
//# sourceMappingURL=alvariable.js.map