"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.alHungarianOptions = alHungarianOptions;
class alHungarianOption {
    constructor(value) {
        this.alType = value.substring(0, value.indexOf(',')).toUpperCase();
        this.abbreviation = value.substring(value.indexOf(',') + 1).toUpperCase();
    }
}
//# sourceMappingURL=hungariannotation.js.map