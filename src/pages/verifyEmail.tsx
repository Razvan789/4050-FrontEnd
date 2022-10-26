import React, { useEffect, useState } from 'react'
import Layout from '../components/layout'
import { TextField, Button, LinearProgress } from '@mui/material'
import Link from 'next/link'
import { encrypt } from '../utils/encryption'
import { useRouter } from 'next/router'
import {serverUrl} from '../utils/backendInfo'
import {User, useUser} from '../utils/user'
import { setRevalidateHeaders } from 'next/dist/server/send-payload'

function testEncryption() {
    var bcrypt = require('bcryptjs'); //This line is wrong, you need to use import not require
    const text = 'Hello World';
    const key = bcrypt.genSaltSync(10);
    const encrypted = encrypt(text, key);
    console.log(encrypted);
    console.log("this is the comparison between the unecrypted and encrypted passwords " + bcrypt.compareSync(text, encrypted));

}



export default function VerifyEmail() {
    const [verifiedState, setVerified] = useState(false);
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        if (router.query.token) {
            console.log("token is " + router.query.token);
            handleVerifyEmail(router.query.token as string);
        } 
    }, []);

    function handleVerifyEmail(token: string) {

        fetch(`${serverUrl}/verify-user?token=${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(token)
        }).then(res => {
                if (res.status == 200) {
                    console.log('User Verified');
                    setVerified(true);
                    console.log("success code should be successful here: " + verifiedState);
                } else {                     
                    console.log("success code should be a failure here: " + verifiedState);
                }
        });
    }

    return (
        <Layout>
            {!verifiedState ? // Not verified
                    <>

                        <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-600">
                            <span className="text-primary">Verifing</span> Email
                        </h1>
                        <div className='w-[80%] mx-auto'>
                            <LinearProgress />
                        </div>
                    </>
                    : //Verified
                    <>
                        <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-600">
                            <span className="text-primary">Email</span> Verified
                        </h1>
                        <Link href="/login">
                            <Button variant="contained" color="primary" className="bg-primary w-[150px] mx-auto font-extrabold">Go To Login</Button>
                        </Link>

                    </>
            }

        </Layout>
    )
}


