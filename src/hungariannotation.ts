export class alHungarianOptions {
    content : string;
    alHungarianOption : alHungarianOption[];
    constructor (value : string) {
        this.alHungarianOption = [];
        let hungariannotationoptions = value.split(';');
        hungariannotationoptions.forEach((hungariannotationoption, i) => {
            this.alHungarianOption.push();
            this.alHungarianOption[i] = new alHungarianOption(hungariannotationoption);
        });
    }
}

class alHungarianOption {
    content : string;
    alType : string;
    abbreviation : string;
    constructor (value : string) {
        this.alType = value.substring(0, value.indexOf(',')).toUpperCase();
        this.abbreviation = value.substring(value.indexOf(',') + 1).toUpperCase();        
    }
}
