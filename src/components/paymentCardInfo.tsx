import React from 'react'
import StyleBox from './styleBox'
import { Button, TextField } from '@mui/material'
import {serverUrl} from '../utils/backendInfo'

interface Props {
    cardNum: string,
    cardExp: string,
    cardID: number,
}

type CardInfo = {
    cardNum: string,
    cardExp: string,
    cardID: string,
}

export default function PaymentCardInfo({ cardNum, cardExp, cardID }: Props) {

    const [newCardInfo, setNewCardInfo] = React.useState();
    function editCard() {
        fetch(`${serverUrl}/payment-card`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentID: cardID,
                paymentNum: cardNum,
                expDate: cardExp,
            })
        }).then((res)=>{
            console.log(res);
        });
    }

    function deleteCard() {
        console.log('Delete Card', cardID);
    }

    return (
        <StyleBox>
            <div className='flex justify-between'>
                <div className="flex flex-col justify-center text-text-light font-extrabold">
                    <h1 className=''>Card Number: {cardNum}</h1>
                    <h1 className=''>Card Expiration: {cardExp}</h1>
                    <h1 className=''>Card ID: {cardID}</h1>
                </div>
                <div className='my-auto flex flex-col'>
                </div>
            </div>
        </StyleBox>
    )
}


function PaymentCardForm(){
    const [cardInfo, setCardInfo] = React.useState<CardInfo>({
        cardNum: '',
        cardExp: '',
        cardID: '',
    });

    function submitCard(){
        console.log('submitting card', cardInfo);
    }

    return (
        <StyleBox>
            <h1 className='text-2xl font-bold text-text-light'>Add Payment Card</h1>
            <div className='flex flex-col'>
                <TextField label='Card Number' variant='outlined' className='my-2' onChange={(e)=> setCardInfo({...cardInfo, cardNum: e.target.value})}/>
                <TextField label='Expiration Date' variant='outlined' className='my-2' onChange={(e)=> setCardInfo({...cardInfo, cardExp: e.target.value})}/>
                <Button variant='contained' color='primary' className='my-2' onClick={submitCard}>Submit</Button>
            </div>
        </StyleBox>
    )
}