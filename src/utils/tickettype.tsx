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

export async function addTicketType(tickettype: TicketType): Promise<boolean> {
    return new Promise<boolean>( (resolve, reject) => {
        fetch(`${serverUrl}/ticket-type`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tickettype)
        }).then(res => res.json()).then(data => {
            resolve(data as boolean);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

export async function editTicketType(tickettype: TicketType): Promise<boolean> {
    return new Promise<boolean>( (resolve, reject) => {
        fetch(`${serverUrl}/ticket-type`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tickettype)
        }).then(res => res.json()).then(data => {
            resolve(data as boolean);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}


export async function getAllTicketTypes(): Promise<TicketType[]> {
    return new Promise<TicketType[]>( (resolve, reject) => {
        fetch(`${serverUrl}/ticket-type`).then(res => {
            if(res.status === 200) {
            return res.json();
            } else {
                reject(res.status);
                return;
            }
        }).then(data => {
            resolve(data as TicketType[]);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}