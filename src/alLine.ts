import { alCodePart } from "./alCodePart";

export class alLine {
    content: string;
    isCode: boolean;
    lineNumber : number;
    upperCase : string;
    trim : string;
    alCodePart : alCodePart[];
    constructor (content :string, lineNumber : number) {
        this.content = content;
        this.trim = content.trim();
        this.upperCase = content.toUpperCase().trim();
        this.alCodePart = [];
        
        var length : number = 0;
        var word : string;
        var n : number = 0;
        
        for (var i = 0; i < this.trim.length; i++) {
            if (this.trim.charAt(i) == ' ') {
                length++;
                if (word != "") {
                    this.alCodePart.push();
                    this.alCodePart[n] = new alCodePart(word, i);
                    n++;    
                }
                word = "";
            }
            else
               word = word + this.trim.charAt(i);

        }
    
    }
}
