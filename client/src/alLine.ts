
export class alLine {
    content: string;
    isCode: boolean;
    upperCase: string;
    trim: string;
    constructor(content: string) {
        this.content = content;
        this.trim = content.trim();
        this.upperCase = content.toUpperCase().trim();
    }
}
