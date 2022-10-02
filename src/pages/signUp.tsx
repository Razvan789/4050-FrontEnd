import React from 'react'
import Layout from '../components/layout'
import StyleBox from '../components/styleBox'
import { TextField, Button, Divider } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import Link from 'next/link'
import useWindowDimensions from '../utils/windowControl'

export default function SignUp() {
    const [cardDetailsOpen, setCardDetailsOpen] = useState(false);
    const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
    const screen = useWindowDimensions();

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
                    <span className="text-primary">Sign</span> Up
                </h1>
                <div className="lg:flex">
                    <form className='flex flex-col space-y-6 p-4 mb-4 w-full'>
                        <TextField variant='standard' type="email" label='Email'></TextField>
                        <TextField variant='standard' type="text" label='Username'></TextField>
                        <TextField variant='standard' type="text" label='Phone Number'></TextField>
                        <TextField variant='standard' type="password" label='Password'></TextField>
                        <TextField variant='standard' type="password" label='Confirm Password'></TextField>
                    </form>
                    <div className={cardDetailsOpen ? "block w-full" : "hidden"}>
                        {/* <Divider className='lg:float-left' orientation={
                            screen?.width >= 1024 ? "vertical" : "horizontal"
                            } /> */}
                        <form className='flex flex-col space-y-6 p-4 mb-4'>
                            <TextField variant='standard' type="text" label='Cardholder Name'></TextField>
                            <TextField variant='standard' type="text" label='Card Number'></TextField>
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
                            <TextField variant='standard' type="text" label='CCV'></TextField>
                        </form>
                    </div>
                </div>
                <Button className='w-full my-2' onClick={handleOpenCard}> {cardDetailsOpen ? "Not Right Now" : "Add a Payment Method"}</Button>

                <Link href='/login'>
                    <Button className="bg-primary w-full font-extrabold" variant='contained'>Sign Up</Button>
                </Link>
                <Link href='/login'><p className='text-primary cursor-pointer text-center mt-3 underline'>Return to Login</p></Link>
            </StyleBox>
        </Layout>
    )
}
