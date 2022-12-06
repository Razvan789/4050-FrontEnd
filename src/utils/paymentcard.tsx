import { serverUrl } from "./backendInfo"; 
export type PaymentCard = {
    paymentID: number,
    userID: number,
    paymentNum: string,
    CCV: string,
    expDate: string,
}


export async function getPaymentCardByUserID(id: number | undefined): Promise<PaymentCard[]> {
    if(id === undefined) {
        return [];
    }
    return new Promise<PaymentCard[]>( (resolve, reject) => {
        fetch(`${serverUrl}/payment-card?userID=${id}`).then(res => {
            if(res.status === 200) {
            return res.json()
            } else {
                reject(res.status);
                return;
            }
        }).then(data => {
            resolve(data as PaymentCard[]);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

export async function addPaymentCard(paymentCard: PaymentCard): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/payment-card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentCard)
        }).then(res => {
            if (res.status === 200) {
                resolve(true);
            } else {
                reject(res.status);
                return;
            }
        }).catch(err => {
            reject(err);
        })
    });
}

export function getLast4Digits(paymentNum: string): string {
    return paymentNum.slice(-4);
}

export async function deletePaymentCard(paymentID: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/payment-card?paymentID=${paymentID}`, {
            method: 'DELETE'
        }).then(res => {
            if (res.status === 200) {
                resolve(true);
            } else {
                reject(res.status);
                return;
            }
        }).catch(err => {
            reject(err);
        })
    });
}