import React, {useState} from 'react'
import Layout from '../components/layout'
import { TextField, Button, Divider } from '@mui/material'
import StyleBox from '../components/styleBox'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ResetEmailForm, ResetPasswordForm } from '../components/forms'

export default function ResetPassword() {
    const router = useRouter();
    return (
        <Layout>
            <StyleBox>
                {router.query.token ?
                    <>
                        <h1 className="w-full text-center text-5xl leading-normal font-extrabold text-gray-600 ">
                            <span className="text-primary">Reset</span> Password
                        </h1>
                        <Divider />
                        <ResetPasswordForm token={router.query.token as string}/>
                    </>
                    :
                    <>
                        <h1 className="w-full text-center text-5xl leading-normal font-extrabold text-gray-600 ">
                            <span className="text-primary">Enter</span> Email
                        </h1>
                        <Divider />
                        <ResetEmailForm />
                    </>
                }
                <div className="flex flex-col text-center">
                    <Link href='/login'><p className='text-primary cursor-pointer underline'>Return to Login</p></Link>
                    <p className="text-text-light">Need an account? <Link href='/signUp'><span className="cursor-pointer underline text-primary">Sign up</span></Link></p>
                </div>
            </StyleBox>
        </Layout>
    )
}
