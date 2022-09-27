import React from 'react'
import Layout from '../components/layout'
import StyleBox from '../components/styleBox'
import { TextField, Button, Divider } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import Link from 'next/link'
export default function SignUp() {
    const [cardDetailsOpen, setCardDetailsOpen] = useState(false);
    const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);

    function handleOpenCard() {
        if (cardDetailsOpen) {
            setCardDetailsOpen(false);
        } else {
            setCardDetailsOpen(true)
        }
    }

    return (
        <Layout>
            <StyleBox className="transition-all">
                <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-600 ">
                    <span className="text-purple-300">Sign</span> Up
                </h1>
                <form className='flex flex-col space-y-6 p-4'>
                    <TextField variant='standard' type="email" label='Email'></TextField>
                    <TextField variant='standard' type="text" label='Username'></TextField>
                    <TextField variant='standard' type="password" label='Password'></TextField>
                    <TextField variant='standard' type="password" label='Confirm Password'></TextField>

                    <Button onClick={handleOpenCard}> {cardDetailsOpen ? "Not Right Now" : "Add a Payment Method"}</Button>
                </form>
                <div className={cardDetailsOpen ? "block" : "hidden"}>
                    <Divider />
                    <form className='flex flex-col space-y-6 p-4 mb-4'>
                        <TextField variant='standard' type="text" label='Cardholder Name'></TextField>
                        <TextField variant='standard' type="text" label='Card Number'></TextField>
                        <DatePicker views={['year', 'month']}
                            label="Year and Month"
                            minDate={dayjs('2012-03-01')}
                            maxDate={dayjs('2023-06-01')}
                            value={expirationDate}
                            onChange={(newValue) => {
                                setExpirationDate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} variant='standard' helperText={null} />}
                        />
                        <TextField variant='standard' type="text" label='CCV'></TextField>
                    </form>
                </div>
                <Link href='/login'>
                    <Button className="bg-purple-300 w-full font-extrabold" variant='contained'>Sign Up</Button>
                </Link>
            </StyleBox>
        </Layout>
    )
}
