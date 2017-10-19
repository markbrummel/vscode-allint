export function getHalstead(businessLogic: string, unique: boolean): number {

    var vocabulary: number = 0;
    var length: number = 0;
    var word: string = "";
    var allWords: string[] = [];
    var p: number = 0;
    var useSpace: boolean = false;
    var usePeriod: boolean = false;
    var useComma: boolean = false;
    var useColon: boolean = false;
    var useSemiColon: boolean = false;
    var useParentheses: boolean = false;

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
        var distinctWords: string[] = [];
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
