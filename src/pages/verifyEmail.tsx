import React, {useState} from 'react'
import Layout from '../components/layout'
import { TextField, Button, LinearProgress } from '@mui/material'
import Link from 'next/link'


export default function VerifyEmail() {
    const [verified, setVerified] = useState(false);
    return (
        <Layout>
            {!verified ? // Not verified
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
