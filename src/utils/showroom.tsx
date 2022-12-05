import { serverUrl } from "./backendInfo";
export type Showroom = {
    showroomID: number;
    roomName: string;
    numSeats: number;
    cinemaID: number;
}

export async function getShowroom(idToSelect: string, id: number): Promise<Showroom> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/showroom?${idToSelect}=${id}`).then(res => res.json()).then(data => {
            resolve(data as Showroom);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}