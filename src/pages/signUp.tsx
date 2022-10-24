import React from 'react'
import Layout from '../components/layout'
import StyleBox from '../components/styleBox'
import { TextField, Button, Divider } from '@mui/material'
import { useState } from 'react'
import Link from 'next/link'
import useWindowDimensions from '../utils/windowControl'
import { SignUpForm, signUpInfo } from '../components/forms'

export default function SignUp() {
    const [cardDetailsOpen, setCardDetailsOpen] = useState(false);

    const [signUpInfo, setSignUpInfo] = useState<signUpInfo>({} as signUpInfo);

    function handleSignUpChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSignUpInfo({
            ...signUpInfo,
            [event.target.name]: event.target.value
        } as signUpInfo);
    }

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
                <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-text-dark">
                    <span className="text-primary">Sign</span> Up
                </h1>
                <div className="lg:flex">
                    <SignUpForm formInfo={signUpInfo} handleSignUpChange={handleSignUpChange} cardDetailsOpen={cardDetailsOpen} />
                </div>
                <Button className='w-full my-2' onClick={handleOpenCard}> {cardDetailsOpen ? "Not Right Now" : "Add a Payment Method"}</Button>

                {/* <Link href='/login'> */}
                    <Button className="bg-primary w-full font-extrabold" variant='contained' onClick={()=>{console.log(signUpInfo)}}>Sign Up</Button>
                {/* </Link> */}
                <Link href='/login'><p className='text-primary cursor-pointer text-center mt-3 underline'>Return to Login</p></Link>
            </StyleBox>
        </Layout>
    )
}
