import { serverUrl } from "./backendInfo";

export type Promo = {
    promoID: number;
    promoCode: string;
    percentage: number;
    startTime: string;
    endTime: string;
}

export async function getPromo(id: number): Promise<Promo> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/promotion?promoID=${id}`).then(res => res.json()).then(data => {
            resolve(data as Promo);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

export async function getAllPromos(): Promise<Promo[]> {
    return new Promise<Promo[]>( (resolve, reject) => {
        fetch(`${serverUrl}/promotion`).then(res => res.json()).then(data => {
            resolve(data as Promo[]);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}