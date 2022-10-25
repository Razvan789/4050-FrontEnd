import { type } from "os";
import React, {useState, useEffect} from "react";

export type User = {
    userID: number,
    name: string,
    lastname: string,
    email: string,
    password: string,
    paymentSaved: boolean,
    phone: string,
    type: string,
    address: string,
    status: string,
    promotionSubscribed: boolean,
} | null;


export function useUser() {
    const [user, setUser] = useState<User>(null);
    useEffect(() => {
        const tempUser = typeof window !== 'undefined' ? JSON.parse(window.sessionStorage.getItem('user') || '{}') : {};
        setUser(tempUser);
    }, [])
    return user;
}