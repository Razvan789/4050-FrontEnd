import {useState, useEffect} from "react";
import { serverUrl } from "./backendInfo";

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
    subToPromo: boolean,
} | null;


export function useUser() {
    const [user, setUser] = useState<User>(null);
    useEffect(() => {
        const tempUser = typeof window !== 'undefined' ? JSON.parse(window.sessionStorage.getItem('user') || '{}') : {};
        setUser(tempUser);
    }, [])
    return user;
}

export async function getUsers(): Promise<User[]> {
    const response = await fetch(`${serverUrl}/get-users`);
    const data = await response.json();
    console.log(data);
    return data as User[];
}