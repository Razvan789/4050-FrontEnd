import Layout from "../components/layout"
import Head from 'next/head'
import { Box, TextField, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import Link from "next/link"
export default function login() {
    return (
        <Layout>
            <div className="rounded-xl border-2 border-primary w-[400px] mx-auto my-10 p-3 pt-0 bg-slate-900">
                <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-600">
                    <span className="text-primary">Login</span>
                </h1>
                <FormGroup>
                    <div className="flex flex-col space-y-3">
                        <TextField id="outlined-basic" label="Email" type="email" variant="standard" />
                        <TextField id="outlined-basic" label="Password" type="password" variant="standard" />
                        <FormControlLabel className="text-white" control={<Checkbox />} label="Remember Me" />

                        <Link href='/?user=test'>
                            <Button className="mx-auto w-full bg-primary font-extrabold" variant="contained">Login</Button>
                        </Link>

                        <div className="flex flex-col text-center">
                            <p className="text-white">Need an account? <Link href='/signUp'><span className="cursor-pointer underline text-primary">Sign up</span></Link></p>
                            <p className="text-white">Forgot your password? <Link href='/resetPassword'><span className="cursor-pointer underline text-primary">Reset Password</span></Link></p>
                        </div>
                    </div>
                </FormGroup>

            </div>
        </Layout>
    )
}
