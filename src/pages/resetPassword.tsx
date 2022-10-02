import React from 'react'
import Layout from '../components/layout'
import { TextField, Button, Divider } from '@mui/material'
import StyleBox from '../components/styleBox'
import Link from 'next/link'
import { useRouter } from 'next/router'


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
                        <form className='flex flex-col space-y-6 p-4'>
                            <TextField variant='standard' type="password" label='New Password'></TextField>
                            <TextField variant='standard' type="password" label='Confirm New Password'></TextField>
                            <Link href='/login'>
                                <Button className='bg-primary m-4 mt-8 font-extrabold ' variant='contained'>Reset Password</Button>
                            </Link>

                        </form>
                    </>
                    :
                    <>
                        <h1 className="w-full text-center text-5xl leading-normal font-extrabold text-gray-600 ">
                            <span className="text-primary">Enter</span> Email
                        </h1>
                        <Divider />
                        <form className='flex flex-col space-y-6 p-4'>
                            <TextField id='emailInput' variant='standard' type="email" label='Email'></TextField>
                            <Link href='/resetPassword?token=123'>
                                <Button className='bg-primary m-4 mt-8 font-extrabold ' variant='contained'>Send Reset Email</Button>
                            </Link>
                        </form>
                    </>
                }
                <div className="flex flex-col text-center">
                    <Link href='/login'><p className='text-primary cursor-pointer underline'>Return to Login</p></Link>
                    <p className="text-white">Need an account? <Link href='/signUp'><span className="cursor-pointer underline text-primary">Sign up</span></Link></p>
                </div>
            </StyleBox>
        </Layout>
    )
}
