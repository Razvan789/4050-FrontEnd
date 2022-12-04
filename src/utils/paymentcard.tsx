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