import { serverUrl } from "./backendInfo";

export type Booking = {
    bookingID?: number;
    customerID: number;
    showID: number;
    total: number;
    paymentID: number;
    promoID?: number;
}


export async function getBooking(id: number): Promise<Booking> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/booking?bookingID=${id}`).then(res => res.json()).then(data => {
            resolve(data as Booking);
        }).catch(err => {
            reject(err);
        })
    });
}