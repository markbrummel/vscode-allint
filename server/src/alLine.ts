import { alCodePart } from "./alCodePart";

export class alLine {
    content: string;
    isCode: boolean;
    lineNumber: number;
    upperCase: string;
    trim: string;
    alCodePart: alCodePart[];
    constructor(content: string) {
        this.content = content;
        this.trim = content.trim();
        this.upperCase = content.toUpperCase().trim();
    }
}
