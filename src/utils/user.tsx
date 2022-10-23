import { type } from "os";
import React from "react";

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
} | null;