import { serverUrl } from "./backendInfo";
export type Ticket = {
    ticketID?: number;
    bookingID: number;
    seatID: number;
    typeID: number;
}


export async function getTicket(id: number): Promise<Ticket> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/ticket?ticketID=${id}`).then(res => res.json()).then(data => {
            resolve(data as Ticket);
        }).catch(err => {
            reject(err);
        })
    });
}


export async function addTicket(ticket: Ticket): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticket)
        }).then(res => {
            if (res.status === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(err => {
            reject(err);
        })
    });
}