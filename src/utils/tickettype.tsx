import { serverUrl } from "./backendInfo";

export type TicketType = {
    typeID?: number;
    type: string;
    price: number;
    ticketCount: number;
}

export async function getTicketTypes(): Promise<TicketType[]> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/ticket-type`).then(res => res.json()).then(data => {
            resolve(data as TicketType[]);
        }).catch(err => {
            reject(err);
        })
    });
}