export class alCodePart {
    content: string;
    functionName: string;
    lineNumber : number;
    startsAt : string;
    endsAt : string;
    type : string
    constructor (content :string, lineNumber : number) {
        this.content = content;
//        this.trim = content.trim();
//        this.upperCase = content.toUpperCase().trim();
    }
}
