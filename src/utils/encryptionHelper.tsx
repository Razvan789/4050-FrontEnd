import React, { useState, useEffect } from 'react'
import { serverUrl } from '../utils/backendInfo'
import bcrypt, { hash } from 'bcryptjs';

export function encryptCardNumber(cardNum: string, salt: number) {
    //const stringCardNum = JSON.stringify(cardNum);
    let lastFourNums = "";
    for (let i = 0; i < cardNum.length; i++){
        if (i > cardNum.length - 4) {
            lastFourNums += cardNum[i];
        } 
    }
    bcrypt.hash(cardNum, salt, (err, hash) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(hash)
        hash += lastFourNums;
    }) 
    return hash;
}

export function encryptPassword(password: string, salt: number) {
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(hash)
    })
    return hash;
}

export async function encryptCompare(password : string, hash: string){
    if (await bcrypt.compare(password, hash))
        return true;
    else;
        return false
}