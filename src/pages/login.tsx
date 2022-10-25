import Layout from "../components/layout"
import Head from 'next/head'
import { Box, TextField, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import Link from "next/link"
import { useContext } from "react"
import { UserContext } from "../components/layout"
import { User } from "../utils/user"
import { LoginForm } from "../components/forms"
export default function Login() {
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
