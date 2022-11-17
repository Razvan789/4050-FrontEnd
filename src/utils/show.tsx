import { serverUrl } from "./backendInfo";

export type Show = {
    showID: number;
    movieID: number;
    showroomID: number;
    movieTime: string;
}


export async function getShow(idToSelect: string ,id: number): Promise<Show> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/show?${idToSelect}=${id}`).then(res => res.json()).then(data => {
            resolve(data as Show);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

export async function getAllShows(): Promise<Show[]> {
    return new Promise<Show[]>( (resolve, reject) => {
        fetch(`${serverUrl}/show`).then(res => res.json()).then(data => {
            resolve(data as Show[]);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}