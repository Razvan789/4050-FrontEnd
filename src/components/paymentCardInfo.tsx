import React, {useState, useEffect} from 'react'
import StyleBox from './styleBox'
import { Button, TextField } from '@mui/material'
import {serverUrl} from '../utils/backendInfo'
import { PaymentCard, getLast4Digits, deletePaymentCard} from '../utils/paymentcard'
import {getBookingByPaymentID} from '../utils/booking'
import { useRouter } from 'next/router'

// TODO: Add a delete and edit button that will pop up modals
export default function PaymentCardInfo({card} : {card: PaymentCard}) {
    const [canDelete, setCanDelete] = useState(false);
    const [successCode, setSuccessCode] = useState(0); // 0- waiting 1- Sucess 2- Error
    const router = useRouter();
    useEffect(() => {
        //Check if bookings exist for this card
        getBookingByPaymentID(card.paymentID).then((data) => {
            if(data.length == 0){
                setCanDelete(true);
            }
        }).catch((error) => {
            setCanDelete(true);
        })
    }, [card]);

    function deleteCard(id: number) {
        console.log('Delete Card', id);
        deletePaymentCard(id).then(res => {
            setSuccessCode(1);
            router.reload();
        }).catch(err => {   
            console.log(err);
            setSuccessCode(2);
        });
    }


    return (
        <StyleBox>
            <div className='flex justify-between'>
                <div className="flex flex-col justify-center text-text-light font-extrabold">
                    <h1 className=''>Card Number: {getLast4Digits(card.paymentNum)}</h1>
                    <h1 className=''>Card Expiration: {card.expDate}</h1>
                    <h1 className=''>Card CCV: {card.CCV}</h1>
                </div>
                {canDelete ? 
                <div className='my-auto flex flex-col'>
                    <Button variant='outlined' color='error'  onClick={() => deleteCard(card.paymentID)}>Delete</Button>
                    {successCode == 2 ? <h1 className='text-red-500'>Error Deleting Card</h1> : null}
                </div>
                : null
                }
            </div>
        </StyleBox>
    )
}


// function PaymentCardForm(){
//     const [cardInfo, setCardInfo] = React.useState<CardInfo>({
//         cardNum: '',
//         cardExp: '',
//         cardID: '',
//     });

//     function submitCard(){
//         console.log('submitting card', cardInfo);
//     }

//     return (
//         <StyleBox>
//             <h1 className='text-2xl font-bold text-text-light'>Add Payment Card</h1>
//             <div className='flex flex-col'>
//                 <TextField label='Card Number' variant='outlined' className='my-2' onChange={(e)=> setCardInfo({...cardInfo, cardNum: e.target.value})}/>
//                 <TextField label='Expiration Date' variant='outlined' className='my-2' onChange={(e)=> setCardInfo({...cardInfo, cardExp: e.target.value})}/>
//                 <Button variant='contained' color='primary' className='my-2' onClick={submitCard}>Submit</Button>
//             </div>
//         </StyleBox>
//     )
// }