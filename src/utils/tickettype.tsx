import { serverUrl } from "./backendInfo";

export type TicketType = {
    typeID?: number;
    type: string;
    price: number;
}

export async function getTicketType(id: number): Promise<TicketType> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/ticket-type?typeID=${id}`).then(res => res.json()).then(data => {
            resolve(data as TicketType);
        }).catch(err => {
            reject(err);
        })
    });
}