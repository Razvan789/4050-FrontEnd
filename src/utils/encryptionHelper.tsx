import bcrypt from 'bcryptjs';

export function encryptCardNumber(cardNum: string, salt: string) {
    //const stringCardNum = JSON.stringify(cardNum);
    let lastFourNums = "";
    for (let i = 0; i < cardNum.length; i++){
        if (i > cardNum.length - 5) {
            lastFourNums += cardNum[i];
        } 
    }
    //const hash = bcrypt.hashSync(cardNum, salt);
    let hash = bcrypt.hashSync(cardNum, salt);
    // bcrypt.hash(cardNum, salt, (err, hash) => {
    //     if (err) {
    //         console.error(err)
    //         return
    //     }
    //     console.log(hash)
    //     hash += lastFourNums;
    // }) 
    console.log(hash)
    hash += lastFourNums;
    return hash;
}

export function encryptPassword(password: string, salt: string) {
    const hash = bcrypt.hashSync(password, salt);
    // bcrypt.hash(password, salt, (err, hash) => {
    //     if (err) {
    //         console.error(err)
    //         return
    //     }
    //     console.log(hash)
    // })
    return hash;
}

export async function encryptCompare(password : string, hash: string){
    if (await bcrypt.compare(password, hash))
        return true;
    else
        return false
}