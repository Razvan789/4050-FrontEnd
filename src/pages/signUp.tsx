import React from 'react'
import Layout from '../components/layout'
import StyleBox from '../components/styleBox'
import { TextField, Button, Divider } from '@mui/material'
import { useState } from 'react'
import Link from 'next/link'
import useWindowDimensions from '../utils/windowControl'
import { SignUpForm, signUpInfo } from '../components/forms'

export default function SignUp() {
    

    const screen = useWindowDimensions();
    return (
        <Layout>
            <StyleBox className="transition-all">
                <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-text-dark">
                    <span className="text-primary">Sign</span> Up
                </h1>
                <SignUpForm />
                <Link href='/login'><p className='text-primary cursor-pointer text-center mt-3 underline'>Return to Login</p></Link>
            </StyleBox>
        </Layout>
    )
}
