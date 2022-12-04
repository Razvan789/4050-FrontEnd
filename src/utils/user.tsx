import {useState, useEffect} from "react";
import { serverUrl } from "./backendInfo";
import { encryptCompare } from "./encryptionHelper";

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
    return data as User[];
}


export async function updateType(user: User, type: string): Promise<boolean> {
    const response = await fetch(`${serverUrl}/edit-profile?email=${user?.email}&type=${type}`, {
        method: 'PUT',
    });
    return response.status === 200;
}

export async function updateStatus(user: User, status: string): Promise<boolean> {
    const response = await fetch(`${serverUrl}/edit-profile?email=${user?.email}&status=${status}`, {
        method: 'PUT',
    });
    return response.status === 200;
}
