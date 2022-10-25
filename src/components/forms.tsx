import React, { useState, useContext, useEffect } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers'
import { serverUrl } from '../utils/backendInfo';
import { TextField, Button, FormControlLabel, Checkbox, CircularProgress } from '@mui/material'
import Link from 'next/link'
import Router, { useRouter, NextRouter } from 'next/router';
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
    const [successCode, setSuccessCode] = useState(0); //1 = success, 2 = error
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
        fetch(`${serverUrl}/create-user?name=${signUpInfo.firstName}&lastname=${signUpInfo.lastName}&phone=${signUpInfo.firstName}&email=${signUpInfo.email}&password=${signUpInfo.password}&paymentSaved=false&status=inactive&type=customer&address=noadr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpInfo)
        }).then(res => {
            if (res.status == 200) {
                console.log('signup send', signUpInfo);
                setSuccessCode(1);
            }
        })

    }

    function canSignUp(signUpInfo: signUpInfo) {
        if (signUpInfo.firstName.length > 0 && signUpInfo.lastName.length > 0 && signUpInfo.email.length > 0 && signUpInfo.password.length > 0 && signUpInfo.confirmPassword.length > 0 && signUpInfo.phoneNumber.length > 0) {
            if (signUpInfo.password == signUpInfo.confirmPassword) {
                return true;
            }
        }
        return false;
    }

    return (
        <>
            {successCode == 0 ? //If the user has not successfully signed up
                <form noValidate >
                    <div className='lg:flex'>
                        <div id='topField' className='flex flex-col space-y-6 p-4 mb-4 w-full'>
                            <TextField id='email' name="email" variant='standard' type="email" label='Email *' value={signUpInfo.email} onChange={handleSignUpChange}></TextField>
                            <div className='flex w-full'>
                                <TextField name="firstName" className='w-full mr-1' variant='standard' type="text" label='First Name *' value={signUpInfo.firstName} onChange={handleSignUpChange}></TextField>
                                <TextField name="lastName" className='w-full' variant='standard' type="text" label='Last Name *' value={signUpInfo.lastName} onChange={handleSignUpChange}></TextField>
                            </div>
                            <TextField name="phoneNumber" variant='standard' type="text" label='Phone Number *' value={signUpInfo.phoneNumber} onChange={handleSignUpChange}></TextField>
                            <TextField name="password" variant='standard' type="password" label='Password *' onChange={handleSignUpChange}></TextField>
                            <TextField name="confirmPassword" variant='standard' type="password" label='Confirm Password *' onChange={handleSignUpChange}></TextField>
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

                    {canSignUp(signUpInfo) ?
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
    const router = useRouter();
    const [loginCode, setLoginCode] = useState(0); //0 - not logged in, 1 - success,2 - error server, 3 - error account, 4 - error email/password
    const [rememberMe, setRememberMe] = useState(false);
    const [loginInfo, setLoginInfo] = useState<loginInfo>({
        email: '',
        password: '',
    } as loginInfo);

    useEffect(() => {
        if (localStorage.getItem('savedEmail')) {
            setLoginInfo({
                ...loginInfo,
                email: localStorage.getItem('savedEmail') as string
            })
            setRememberMe(true);
        }
    }, []);
    function handleLoginChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLoginInfo({
            ...loginInfo,
            [event.target.name]: event.target.value
        } as loginInfo);
    }

    function handleRememberMeToggle() {
        setRememberMe(!rememberMe);
    }

    function submitLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        fetch(`${serverUrl}/check-user?email=${loginInfo.email}`).then((response) => {
            console.log(response);
            if (response.status == 200) {
                return response.json()
            }
            setLoginCode(2);
            return null;
        }).then((data) => {
            if (data == null) return;
            //Password match check here
            if (data.password == loginInfo.password) {
                if (data.status == 'active') {
                    window.sessionStorage.setItem('user', JSON.stringify(data));
                    if (rememberMe) {
                        localStorage.setItem('savedEmail', loginInfo.email);
                    } else {
                        localStorage.removeItem('savedEmail');
                    }
                    setLoginCode(1);
                    if (data.type == 'admin') {
                        window.sessionStorage.setItem('admin', 'true');
                        router.push('/adminPage');
                    } else {
                        router.push('/');
                    }
                } else {
                    setLoginCode(3);
                }
            } else {
                setLoginCode(4);
            }
        });
    }
    return (
        <>
            {loginCode != 1 ?
                <form noValidate onSubmit={submitLogin}>
                    <div className="flex flex-col space-y-3">
                        <TextField name='email' label="Email" type="email" variant="standard" value={loginInfo.email} onChange={handleLoginChange} />
                        <TextField name='password' label="Password" type="password" variant="standard" value={loginInfo.password} onChange={handleLoginChange} />
                        <FormControlLabel className="text-text-light" control={<Checkbox checked={rememberMe} onChange={handleRememberMeToggle} />} label="Remember Me" />

                        {loginCode == 2 ? <h3 className='text-xl font-extrabold text-red-600'>Login Error Please try again</h3> : null}
                        {loginCode == 3 ? <h3 className='text-xl font-extrabold text-red-600'>Your account is not active, please check your email</h3> : null}
                        {loginCode == 4 ? <h3 className='text-xl font-extrabold text-red-600'>Password is incorrect</h3> : null}
                        <Button className="mx-auto w-full bg-primary font-extrabold" variant="contained" type='submit'>Login</Button>
                        <div className="flex flex-col text-center">
                            <p className="text-text-light">Need an account? <Link href='/signUp'><span className="cursor-pointer underline text-primary">Sign up</span></Link></p>
                            <p className="text-text-light">Forgot your password? <Link href='/resetPassword'><span className="cursor-pointer underline text-primary">Reset Password</span></Link></p>
                        </div>
                    </div>
                </form>
                :
                <div className='flex flex-col justify-center space-y-6 p-4 mb-4 text-text-light'>
                    <CircularProgress disableShrink />
                    <h1 className='text-2xl font-bold'>Logging In...</h1>
                    <p className='text-lg'>Please wait while we log you in.</p>
                </div>
            }
        </>
    )
}

export function signOut() {
    window.sessionStorage.removeItem('user');
    window.sessionStorage.removeItem('admin');
    window.location.href = '/';
}

// export function UpdatePasswordForm() {
//     const [success, setSuccess] = useState(false);
//     const [newPasswordInfo, setNewPassword] = useState<newPasswordInfo>({
//         email: '',
//         currentPassword: '',
//         newPassword: '',
//     } as newPasswordInfo);

//     function handleUpdatePassword(event: React.ChangeEvent<HTMLInputElement>) {
//         setNewPassword({
//             ...newPasswordInfo,
//             [event.target.name]: event.target.value
//         } as newPasswordInfo);
//     }

//     function sendNewPassword() {
//         fetch(`${serverUrl}/edit-profile?email= ${user?.email}password=${newPasswordInfo.newPassword}`, {
//             method: 'PUT',
//             body: JSON.stringify(newPasswordInfo)
//         }).then((response) => {
//             if (newPasswordInfo.currentPassword === user?.password) {
//                 setSuccess(true);
//             }
//             if (response.status == 200) {
//                 console.log('update password send', newPasswordInfo);
//                 setSuccess(true);
//             }
//         })
        
//     }
// }