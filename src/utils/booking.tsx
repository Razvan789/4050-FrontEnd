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

export async function getBookingsByUserID(userID: number): Promise<Booking[]> {
    return new Promise<Booking[]>((resolve, reject) => {
        fetch(`${serverUrl}/booking?customerID=${userID}`).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                reject(res.status);
                return;
            }
        }).then(data => {
            resolve(data as Booking[]);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

export async function getBookingByPaymentID(paymentID: number): Promise<Booking[]> {
    return new Promise<Booking[]>((resolve, reject) => {
        fetch(`${serverUrl}/booking?paymentID=${paymentID}`).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                reject(res.status);
                return;
            }
        }).then(data => {
            resolve(data as Booking[]);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

export async function addBooking(booking: Booking): Promise<Booking> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(booking)
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                reject(res.status);
                return;
            }
        }).then(data => {
            resolve(data as Booking);
        }).catch(err => {
            reject(err);
        })
    });
}