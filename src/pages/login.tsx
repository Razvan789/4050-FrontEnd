import Layout from "../components/layout"
import Head from 'next/head'
import { Box, TextField, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import Link from "next/link"
import { useEffect } from "react"
import { User , useUser} from "../utils/user"
import { useRouter } from "next/router"
import { LoginForm } from "../components/forms"
export default function Login() {
    const user: User = useUser();
    const router = useRouter();
    useEffect(() => {
        if (user?.name != null) {
            router.push("/");
        }
    }, [user])
    
    return (
        <Layout>
            <div className="rounded-xl border-2 border-primary w-[400px] mx-auto my-10 p-3 pt-0 bg-bg-dark">
                <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-600">
                    <span className="text-primary">Login</span>
                </h1>
                <LoginForm />
            </div>
        </Layout>
    )
}
