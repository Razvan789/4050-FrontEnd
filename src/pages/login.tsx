import Layout from "../components/layout"
import Head from 'next/head'
import { Box, TextField, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import Link from "next/link"
export default function login() {
    return (
        <Layout>
            <Box className="rounded-xl border-2 border-purple-300 w-[400px] m-auto p-3 pt-0">
                <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-600">
                    <span className="text-purple-300">Login</span>
                </h1>
                <FormGroup>
                    <div className="flex flex-col space-y-3">
                        <TextField id="outlined-basic" label="Email" type="email" variant="standard" />
                        <TextField id="outlined-basic" label="Password" type="password" variant="standard" />
                        <FormControlLabel className="text-white" control={<Checkbox />} label="Remember Me" />
                        <div className="flex">
                            <p className="text-white">Need an account? <Link href='/signUp'><span className="cursor-pointer underline text-purple-300">Sign up</span></Link></p>
                            <Button className="ml-auto bg-purple-300" variant="contained">Login</Button>
                        </div>
                    </div>
                </FormGroup>

            </Box>
        </Layout>
    )
}
