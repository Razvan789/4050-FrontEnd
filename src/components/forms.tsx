import React, { useState } from 'react'
import { TextField, Box } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers'

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

interface SignUpFormProps {
    formInfo: signUpInfo,
    handleSignUpChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    cardDetailsOpen: boolean,
}

export function SignUpForm({ formInfo, handleSignUpChange, cardDetailsOpen }: SignUpFormProps) {
    const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
    return (
        <form className='flex flex-col space-y-6 p-4 mb-4 w-full'>
            <TextField id='email' name="email" variant='standard' type="email" label='Email'></TextField>
            <div className='flex w-full'>
                <TextField name="firstName" className='w-full mr-1' variant='standard' type="text" label='First Name' value={formInfo?.firstName} onChange={handleSignUpChange}></TextField>
                <TextField name="lastName" className='w-full' variant='standard' type="text" label='Last Name' value={formInfo?.lastName} onChange={handleSignUpChange}></TextField>
            </div>
            <TextField name="phoneNumber" variant='standard' type="text" label='Phone Number' onChange={handleSignUpChange}></TextField>
            <TextField name="password" variant='standard' type="password" label='Password' onChange={handleSignUpChange}></TextField>
            <TextField name="confirmPassword" variant='standard' type="password" label='Confirm Password' onChange={handleSignUpChange}></TextField>

            <div className={cardDetailsOpen ? "block w-full" : "hidden"}>
                {/* <Divider className='lg:float-left' orientation={
                            screen?.width >= 1024 ? "vertical" : "horizontal"
                            } /> */}
                <div className='flex flex-col space-y-6 mb-4'>
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
        </form>
    )
}
