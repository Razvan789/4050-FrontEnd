import React from 'react'
import Layout from '../components/layout'
import { TextField, Button, Divider } from '@mui/material'
import StyleBox from '../components/styleBox'
import Link from 'next/link'


export default function ResetPassword() {
    return (
        <Layout>
            <StyleBox>
                <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-600 ">
                    <span className="text-purple-300">Reset</span> Password
                </h1>
                <Divider  />
                <form className='flex flex-col space-y-6 p-4'>
                    <TextField variant='standard' type="password" label='New Password'></TextField>
                    <TextField variant='standard' type="password" label='Confirm New Password'></TextField>
                    <Link href='/login'>
                        <Button className='bg-purple-300 m-4 mt-8 font-extrabold ' variant='contained'>Reset Password</Button>
                    </Link>
                    <div className="flex flex-col text-center">
                            <Link href='/login'><p className='text-purple-300 cursor-pointer underline'>Return to Login</p></Link>
                            <p className="text-white">Need an account? <Link href='/signUp'><span className="cursor-pointer underline text-purple-300">Sign up</span></Link></p>
                        </div>
                </form>
            </StyleBox>
        </Layout>
    )
}
