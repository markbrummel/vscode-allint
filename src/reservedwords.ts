export function isReserved(value : string) : boolean {
    if (value == 'SETRANGE') {
        return(true);    
    }
    if (value == 'STOP') {
        return(true);    
    }
    if (value == 'ACTION') {
        return(true);    
    }
    return(false);
}