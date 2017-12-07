'use strict';
import { alObject } from "./alobject";
import { hungariannotationoptions } from "./server";
export class alVariable {
    content: string;
    name: string;
    local: boolean;
    isParameter: boolean;
    byRef: boolean;
    type: string;
    length: string;
    used: number;
    objectId: any;
    objectIdIsANumber: boolean;
    lineNumber: number;
    isHungarianNotation: boolean = false;
    isTemporary: boolean = false;
    suggestedName: string;
    isGlobal: boolean;
    textConst: string;
    isUsed: boolean = false;
    nameContainsSpecialCharacters: boolean = false;
    constructor(value: string, lineNo: number, setIsGlobal: boolean) {
        this.content = value.trim().replace(';', '').replace(')', '');
        this.isGlobal = setIsGlobal;
        this.isUsed = setIsGlobal;
        this.lineNumber = lineNo;
        if (this.content.startsWith('VAR')) {
            this.content = this.content.substring(4); // remove var
            this.byRef = true;
        }
        this.name = this.content.substring(0, this.content.indexOf(':') - 1);
        this.nameContainsSpecialCharacters = this.checkNameForSpecialCharacters();
        this.type = this.content.substring(this.content.indexOf(':') + 2)
        if (this.type.indexOf(' ') > 0) {
            this.objectId = this.type.substring(this.type.indexOf(' ') + 1);
            if (this.objectId.toUpperCase().indexOf('TEMPORARY') != -1) {
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

        /*let hungarianOptions = new alHungarianOptions('Record,Rec;Record,rcd;Integer,Int;Code,Cod;Function,Func;Codeunit,Cdu;Page,Pag;Text,Txt;Field,Fld'); //EXTVAMYK, 2 replace with "allint.hungariannotationoptions" */
        
        let hungarianOptions = new alHungarianOptions(hungariannotationoptions);
        hungarianOptions.alHungarianOption.forEach(hungarianOption => {
            if ((hungarianOption.alType == this.type) && (this.isHungarianNotation == false)) {
                if (isHungarianException(this.name) == false) {
                    this.isHungarianNotation = (this.name.startsWith(hungarianOption.abbreviation));
                }
            }
        });

    }
    hasWrongTempName(): boolean {
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
    hasWrongTextConstName(): boolean {
        if (this.type != 'TEXTCONST') {
            return false;
        }
        if (this.name.toUpperCase().startsWith('TEXT')) {
            return true;
        }
        return false;
    }
    alsoExistAsGlobalOrLocal(alObject: alObject): boolean {
        var found: boolean = false;
        alObject.alVariable.forEach(alVariable => {
            if ((alVariable.name == this.name) && (alVariable.isGlobal != this.isGlobal)) {
                found = true;
            }
        });
        return found;
    }
    checkNameForSpecialCharacters(): boolean {
        var regex = new RegExp(/[_~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?\s]/);
        if (regex.test(this.name)) {
            return true;
        }
        return false;
    }
}

class alHungarianOptions {
    content: string;
    alHungarianOption: alHungarianOption[];
    constructor(value: string) {
        this.alHungarianOption = [];
        let hungariannotationoptions = value.split(';');
        hungariannotationoptions.forEach((hungariannotationoption, i) => {
            this.alHungarianOption.push();
            this.alHungarianOption[i] = new alHungarianOption(hungariannotationoption);
        });
    }
}

class alHungarianOption {
    content: string;
    alType: string;
    abbreviation: string;
    constructor(value: string) {
        this.alType = value.substring(0, value.indexOf(',')).toUpperCase();
        this.abbreviation = value.substring(value.indexOf(',') + 1).toUpperCase();
    }
}

function isHungarianException(value: string): boolean {
    if (value.toUpperCase() == 'REC') {
        return true
    }
    if (value.toUpperCase() == 'XREC') {
        return true
    }
    return false;
}