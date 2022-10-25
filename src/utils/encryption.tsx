export function encrypt(text: string, key: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let c = text.charCodeAt(i);
        let k = key.charCodeAt(i % key.length);
        result += String.fromCharCode(c ^ k);
    }
    return result;
}

