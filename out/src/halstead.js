"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getHalstead(businessLogic, unique) {
    var vocabulary = 0;
    var length = 0;
    var word = "";
    var allWords = [];
    var p = 0;
    var useSpace = false;
    var usePeriod = false;
    var useComma = false;
    var useColon = false;
    var useSemiColon = false;
    var useParentheses = false;
    // To Do : String is one operator
    for (var i = 0; i < businessLogic.length; i++) {
        if (businessLogic.charAt(i) == ' ') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
            useSpace = true;
        }
        else if (businessLogic.charAt(i) == '.') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
            usePeriod = true;
        }
        else if (businessLogic.charAt(i) == ',') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
            useComma = true;
        }
        else if (businessLogic.charAt(i) == ';') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
            useSemiColon = true;
        }
        else if (businessLogic.charAt(i) == ')') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
            useParentheses = true;
        }
        else if (businessLogic.charAt(i) == '(') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
        }
        else if (businessLogic.charAt(i) == ':') {
            length++;
            if (word != "") {
                allWords.push();
                allWords[p] = word;
                p++;
            }
            word = "";
            useColon = true;
        }
        else
            word = word + businessLogic.charAt(i);
    }
    if (unique) {
        if (useColon) {
            vocabulary++;
        }
        if (useComma) {
            vocabulary++;
        }
        if (useParentheses) {
            vocabulary++;
        }
        if (useParentheses) {
            vocabulary++;
        }
        if (useSemiColon) {
            vocabulary++;
        }
        if (useSpace) {
            vocabulary++;
        }
        //list = list.filter((x, i, a) => a.indexOf(x) == i)
        allWords.filter((x, i, a) => a.indexOf(x) == i);
        var distinctWords = [];
        for (var i = 0; i < allWords.length; i++) {
            var str = allWords[i];
            if (distinctWords.indexOf(str) == -1) {
                distinctWords.push(str);
            }
        }
        vocabulary = vocabulary + distinctWords.length;
        return vocabulary;
    }
    else {
        return length;
    }
}
exports.getHalstead = getHalstead;
//# sourceMappingURL=halstead.js.map