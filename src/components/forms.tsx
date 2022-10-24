import React, { useState } from 'react'
import { TextField, Button } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers'
import { serverUrl } from '../utils/backendInfo';
import Link from 'next/link'

export type signUpInfo = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
    cardNumber: string,
    cardName: string,
    cardExpiration: string,
    cardCVC: string,
    phoneNumber: string,
}


export function SignUpForm() {
    const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
    const [cardDetailsOpen, setCardDetailsOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [signUpInfo, setSignUpInfo] = useState<signUpInfo>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        cardNumber: '',
        cardName: '',
        cardExpiration: '',
        cardCVC: '',
        phoneNumber: '',
    } as signUpInfo);

    function handleSignUpChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSignUpInfo({
            ...signUpInfo,
            [event.target.name]: event.target.value
        } as signUpInfo);
    }

    function handleOpenCard() {
        if (cardDetailsOpen) {
            setCardDetailsOpen(false);
        } else {
            setCardDetailsOpen(true)
        }
    }

    function sendSignUpInfo() {
        fetch(`${serverUrl}/create-user?name=${signUpInfo.firstName}&lastname=${signUpInfo.lastName}&phone=${signUpInfo.firstName}&email=${signUpInfo.email}&password=${signUpInfo.password}&paymentSaved=false&status=active&type=admin&address=noadr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            if (res.status == 200) {
                setSuccess(true);
            }
        })
    }
    return (
        <>
            {!success ? //If the user has not successfully signed up
                <form noValidate >
                    <div className='lg:flex'>
                        <div id='topField' className='flex flex-col space-y-6 p-4 mb-4 w-full'>
                            <TextField id='email' name="email" variant='standard' type="email" label='Email' value={signUpInfo.email} onChange={handleSignUpChange}></TextField>
                            <div className='flex w-full'>
                                <TextField name="firstName" className='w-full mr-1' variant='standard' type="text" label='First Name' value={signUpInfo.firstName} onChange={handleSignUpChange}></TextField>
                                <TextField name="lastName" className='w-full' variant='standard' type="text" label='Last Name' value={signUpInfo.lastName} onChange={handleSignUpChange}></TextField>
                            </div>
                            <TextField name="phoneNumber" variant='standard' type="text" label='Phone Number' value={signUpInfo.phoneNumber} onChange={handleSignUpChange}></TextField>
                            <TextField name="password" variant='standard' type="password" label='Password' onChange={handleSignUpChange}></TextField>
                            <TextField name="confirmPassword" variant='standard' type="password" label='Confirm Password' onChange={handleSignUpChange}></TextField>
                        </div>

                        <div id='botField' className={cardDetailsOpen ? "block w-full" : "hidden"}>
                            {/* <Divider className='lg:float-left' orientation={
                            screen?.width >= 1024 ? "vertical" : "horizontal"
                            } /> */}
                            <div className='flex flex-col space-y-6 p-4 mb-4'>
                                <TextField name="cardName" variant='standard' type="text" label='Cardholder Name' onChange={handleSignUpChange}></TextField>
                                <TextField name='cardNumber' variant='standard' type="text" label='Card Number' onChange={handleSignUpChange}></TextField>
                                <DatePicker views={['year', 'month']}
                                    label="Year and Month"
                                    minDate={dayjs()}
                                    maxDate={dayjs().add(10, 'year')}
                                    value={expirationDate}
                                    onChange={(newValue) => {
                                        setExpirationDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} variant='standard' helperText={null} />}
                                />
                                <TextField name="cardCVC" variant='standard' type="text" label='CCV' onChange={handleSignUpChange}></TextField>
                            </div>
                        </div>
                    </div>
                    <Button className='w-full my-2' onClick={handleOpenCard}> {cardDetailsOpen ? "Not Right Now" : "Add a Payment Method"}</Button>

                    {signUpInfo.password === signUpInfo.confirmPassword && signUpInfo.password ?
                        <Button className="bg-primary w-full font-extrabold" variant='contained' onClick={() => { sendSignUpInfo() }}>Sign Up</Button>
                        :
                        <Button className="bg-primary w-full font-extrabold" variant='contained' disabled>Sign Up</Button>
                    }
                </form>
                : //If the user has successfully signed up
                <div className='flex flex-col space-y-6 p-4 mb-4 text-text-light'>
                    <h1 className='text-2xl font-bold'>Success!</h1>
                    <p className='text-lg'>You have successfully signed up for a new account. Please check your email for a confirmation email.</p>
                    <Link href='/login'>
                        <Button className="bg-primary w-full font-extrabold" variant='contained'>Login</Button>
                    </Link>
                </div>
            }
        </>
    )
}
