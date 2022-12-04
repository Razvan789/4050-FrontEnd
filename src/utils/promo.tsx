import { serverUrl } from "./backendInfo";

export type Promo = {
    promoID?: number;
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
        fetch(`${serverUrl}/promotion`).then(res =>{ 
            if(res.status === 200) {
                return res.json();
            } else {
                reject(res.status);
                return;
            }
        }).then(data => {
            resolve(data as Promo[]);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

export async function addPromo(promo: Promo): Promise<number> {
    promo.percentage = promo.percentage / 100;
    return new Promise<number>((resolve, reject) => {
        fetch(`${serverUrl}/promotion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(promo)
        }).then(res => {
            if(res.status === 200) {
                return res.json();
            } else {
                reject(res.status);
                return;
            }
        }).then(data => {
            resolve(data as number);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

export async function getPromoByCode(promoCode: string): Promise<Promo> {
    return new Promise<Promo>((resolve, reject) => {
        fetch(`${serverUrl}/promotion?promoCode=${promoCode}`).then(res => {
            if(res.status === 200) {
                return res.json();
            } else {
                reject(res.status);
                return;
            }
        }).then(data => {
            resolve(data as Promo);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}