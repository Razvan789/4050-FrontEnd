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
            data.forEach((ticketType: TicketType) => {
                ticketType.typeID = ticketType.typeID || -1;
                ticketType.type = ticketType.type || '';
                ticketType.price = ticketType.price || -1;
                ticketType.ticketCount = ticketType.ticketCount || 0;
            });
            //Remove the Fee ticket type
            resolve(data as TicketType[]);
        }).catch(err => {
            reject(err);
        })
    });
}