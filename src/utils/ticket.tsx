import { serverUrl } from "./backendInfo";
export type Ticket = {
    ticketID?: number;
    showID: number;
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


export async function addTicket(ticket: Ticket){
    //body of addTicket here
}