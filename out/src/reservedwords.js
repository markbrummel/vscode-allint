"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isReserved(value) {
    if (value == 'SETRANGE') {
        return (true);
    }
    if (value == 'STOP') {
        return (true);
    }
    if (value == 'ACTION') {
        return (true);
    }
    return (false);
}
exports.isReserved = isReserved;
//# sourceMappingURL=reservedwords.js.map