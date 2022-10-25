import React, { useState, useContext } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers'
import { serverUrl } from '../utils/backendInfo';
import { TextField, Button, FormControlLabel, Checkbox } from '@mui/material'
import Link from 'next/link'
import { UserContext } from './layout';
import { User } from '../utils/user';


export type signUpInfo = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
    cardNumber: string,
    cardName: string,
    cardExpiration: string,
    cardCVC: string,
    phoneNumber: string,
    promotionsSubscribed: boolean,
}

export type loginInfo = {
    email: string,
    password: string,
}


export function SignUpForm() {
    const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
    const [cardDetailsOpen, setCardDetailsOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [signUpInfo, setSignUpInfo] = useState<signUpInfo>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        cardNumber: '',
        cardName: '',
        cardExpiration: '',
        cardCVC: '',
        phoneNumber: '',
        promotionsSubscribed: false,
    } as signUpInfo);

    function handleSignUpChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSignUpInfo({
            ...signUpInfo,
            [event.target.name]: event.target.value
        } as signUpInfo);
    }

    function handleOpenCard() {
        if (cardDetailsOpen) {
            setCardDetailsOpen(false);
        } else {
            setCardDetailsOpen(true)
        }
    }
    function handlePromotionToggle() {
        setSignUpInfo({
            ...signUpInfo,
            promotionsSubscribed: !signUpInfo.promotionsSubscribed
        } as signUpInfo);
    }

    function sendSignUpInfo() {
        fetch(`${serverUrl}/create-user?name=${signUpInfo.firstName}&lastname=${signUpInfo.lastName}&phone=${signUpInfo.firstName}&email=${signUpInfo.email}&password=${signUpInfo.password}&paymentSaved=false&status=active&type=customer&address=noadr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpInfo)
        }).then(res => {
            if (res.status == 200) {
                console.log('signup send', signUpInfo);
                setSuccess(true);
            }
        })
        
    }
    return (
        <>
            {!success ? //If the user has not successfully signed up
                <form noValidate >
                    <div className='lg:flex'>
                        <div id='topField' className='flex flex-col space-y-6 p-4 mb-4 w-full'>
                            <TextField id='email' name="email" variant='standard' type="email" label='Email' value={signUpInfo.email} onChange={handleSignUpChange}></TextField>
                            <div className='flex w-full'>
                                <TextField name="firstName" className='w-full mr-1' variant='standard' type="text" label='First Name' value={signUpInfo.firstName} onChange={handleSignUpChange}></TextField>
                                <TextField name="lastName" className='w-full' variant='standard' type="text" label='Last Name' value={signUpInfo.lastName} onChange={handleSignUpChange}></TextField>
                            </div>
                            <TextField name="phoneNumber" variant='standard' type="text" label='Phone Number' value={signUpInfo.phoneNumber} onChange={handleSignUpChange}></TextField>
                            <TextField name="password" variant='standard' type="password" label='Password' onChange={handleSignUpChange}></TextField>
                            <TextField name="confirmPassword" variant='standard' type="password" label='Confirm Password' onChange={handleSignUpChange}></TextField>
                        </div>

                        <div id='botField' className={cardDetailsOpen ? "block w-full" : "hidden"}>
                            {/* <Divider className='lg:float-left' orientation={
                            screen?.width >= 1024 ? "vertical" : "horizontal"
                            } /> */}
                            <div className='flex flex-col space-y-6 p-4 mb-4'>
                                <TextField name="cardName" variant='standard' type="text" label='Cardholder Name' onChange={handleSignUpChange}></TextField>
                                <TextField name='cardNumber' variant='standard' type="text" label='Card Number' onChange={handleSignUpChange}></TextField>
                                <DatePicker views={['year', 'month']}
                                    label="Year and Month"
                                    minDate={dayjs()}
                                    maxDate={dayjs().add(10, 'year')}
                                    value={expirationDate}
                                    onChange={(newValue) => {
                                        setExpirationDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} variant='standard' helperText={null} />}
                                />
                                <TextField name="cardCVC" variant='standard' type="text" label='CCV' onChange={handleSignUpChange}></TextField>
                            </div>
                        </div>
                    </div>
                    <FormControlLabel className="text-text-light" control={<Checkbox checked={signUpInfo.promotionsSubscribed} onChange={handlePromotionToggle} />} label="Subscribe To promotions?" />
                    <Button className='w-full my-2' onClick={handleOpenCard}> {cardDetailsOpen ? "Not Right Now" : "Add a Payment Method"}</Button>

                    {signUpInfo.password === signUpInfo.confirmPassword && signUpInfo.password ?
                        <Button className="bg-primary w-full font-extrabold" variant='contained' onClick={() => { sendSignUpInfo() }}>Sign Up</Button>
                        :
                        <Button className="bg-primary w-full font-extrabold" variant='contained' disabled>Sign Up</Button>
                    }
                </form>
                : //If the user has successfully signed up
                <div className='flex flex-col space-y-6 p-4 mb-4 text-text-light'>
                    <h1 className='text-2xl font-bold'>Success!</h1>
                    <p className='text-lg'>You have successfully signed up for a new account. Please check your email for a confirmation email.</p>
                    <Link href='/login'>
                        <Button className="bg-primary w-full font-extrabold" variant='contained'>Login</Button>
                    </Link>
                </div>
            }
        </>
    )
}


export function LoginForm() {
    let user = useContext(UserContext);
    const [loginCode, setLoginCode] = useState(0); //Use Reducer instead of state
    const [loginInfo, setLoginInfo] = useState<loginInfo>({
        email: '',
        password: '',
    } as loginInfo);

    function handleLoginChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLoginInfo({
            ...loginInfo,
            [event.target.name]: event.target.value
        } as loginInfo);
    }

    function submitLogin() {
        fetch(`${serverUrl}/check-user?email=${loginInfo.email}`).then((response) => {
            console.log(response);
            if(response.status == 200) {
                return response.json()
            }
            setLoginCode(1);
            return null;
        }).then((data) => {
            if(data == null) return;
            //Password match check here
            if(data.password == loginInfo.password) {
                window.sessionStorage.setItem('user', JSON.stringify(data));
                console.log(data);
                if(data.type == 'admin') {
                    window.sessionStorage.setItem('admin', 'true');
                    window.location.href = '/adminPage';
                } else {
                    window.location.href = "/";
                }
            } 
        });
    }
    return (
        <div className="flex flex-col space-y-3">
            <TextField name='email'  label="Email" type="email" variant="standard" value={loginInfo.email} onChange={handleLoginChange} />
            <TextField name='password'  label="Password" type="password" variant="standard" value={loginInfo.password} onChange={handleLoginChange}/>
            <FormControlLabel className="text-text-light" control={<Checkbox />} label="Remember Me" />

            {loginCode == 1 ? <h3 className='text-xl font-extrabold text-red-600'>Login Error Please try again</h3> : null}
            <Button className="mx-auto w-full bg-primary font-extrabold" variant="contained" onClick={submitLogin}>Login</Button>

            <div className="flex flex-col text-center">
                <p className="text-text-light">Need an account? <Link href='/signUp'><span className="cursor-pointer underline text-primary">Sign up</span></Link></p>
                <p className="text-text-light">Forgot your password? <Link href='/resetPassword'><span className="cursor-pointer underline text-primary">Reset Password</span></Link></p>
            </div>
        </div>
    )
}

export function signOut() {
    window.sessionStorage.removeItem('user');
    window.sessionStorage.removeItem('admin');
    window.location.href = '/';
}