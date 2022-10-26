export function encrypt(text: string, key: string): string {
    var bcrypt = require('bcryptjs');
    var hash = bcrypt.hashSync(text, key);
    //console.log(hash);
    return hash;
}


