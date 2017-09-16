'use strict';
import * as vscode from 'vscode';
import { alObject } from "./alobject";
import { alHungarianOptions } from "./hungariannotation";

export class alField {
    content: string;
    name: string;
    id:any;
    type:string;
    editable:boolean;
    enabled:boolean;
    lineNumber : number;
    isHungarianNotation : boolean = false;
    constructor (content :string, startsAt : number) {
        this.content = content.trim();
        this.lineNumber  = startsAt;
        let values = this.content.split(';');
        values.forEach((value, i) => {
            if (i == 0) { // Id
                this.id = value.toUpperCase().replace('FIELD(', '');        
            }   
            if (i == 1) { // Name
                this.name = value.replace(/"/, '');
                this.name = this.name.replace(/"/, '');
            } 
            if (i == 2) { /// Tyoe
                this.type = value.replace(')', '');                
            }
        });  
        let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));
        if (config.checkhungariannotation) {
            let hungarianOptions = new alHungarianOptions(config.hungariannotationoptions);
            
            hungarianOptions.alHungarianOption.forEach(hungarianOption => {
                if ((hungarianOption.alType == 'FIELD') && (this.isHungarianNotation == false)) {
                    this.isHungarianNotation = (this.name.toUpperCase().indexOf(hungarianOption.abbreviation) != -1);
                }
            });    
        }
  

    }        
}
