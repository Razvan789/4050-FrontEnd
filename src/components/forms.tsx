import React, { useState, useContext, useEffect } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers'
import { serverUrl } from '../utils/backendInfo';
import { TextField, Button, FormControlLabel, Checkbox, CircularProgress } from '@mui/material'
import Link from 'next/link'
import Router, { useRouter, NextRouter } from 'next/router';
import { UserContext } from './layout';
import { User, useUser } from '../utils/user';
import { encrypt } from '../utils/encryption';
// import bcrypt from 'bcryptjs';
// import {salt } from 'bcryptjs';

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
    address: string,
    phoneNumber: string,
    promotionsSubscribed: boolean,
}


export type loginInfo = {
    email: string,
    password: string,
}

export type updateProfileInfo = {
    name: string,
    lastname: string,
    currentPassword: string,
    password: string,
    address: string,
    promotionSubscribed: boolean,

}
export type addPaymentInfo = {
    cardNumber: string,
    cardName: string,
    cardExpiration: string,
    cardCVC: string,
}
export type resetPasswordInfo = {
    password: string,
    confirmPassword: string,
}

//  const salt = bcrypt.genSaltSync(10);

export function SignUpForm() {
    const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
    const [cardDetailsOpen, setCardDetailsOpen] = useState(false);
    const [successCode, setSuccessCode] = useState(0); //1 = success, 2 = error, 3- Email already in use, 4- Card Error
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
        address: '',
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
        // const hashedPassword = encrypt(signUpInfo.password, salt);
        fetch(`${serverUrl}/check-user?email=${signUpInfo.email}`).then((res) => {
            if (res.status === 404) {
                fetch(`${serverUrl}/create-user?name=${signUpInfo.firstName}&lastname=${signUpInfo.lastName}&phone=${signUpInfo.firstName}&email=${signUpInfo.email}&password=${signUpInfo.password}&paymentSaved=${cardDetailsOpen}&status=inactive&type=customer&address=${signUpInfo.address}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signUpInfo)
                }).then(res => {
                    if (res.status == 200) {
                        console.log('signup send', signUpInfo);

                        setSuccessCode(1);
                        return res.json();
                    }
                }).then((data) => {
                    if (data && cardDetailsOpen) {
                        fetch(`${serverUrl}/payment-card`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            //Add CVC here
                            body: JSON.stringify({ paymentNum: signUpInfo.cardNumber, userID: data.userID, expDate: signUpInfo.cardExpiration })
                        }).then(res => {
                            if (res.status == 200) {
                                console.log('Card Added', signUpInfo);
                                setSuccessCode(1);
                                return res.json();
                            } else {
                                setSuccessCode(4);
                            }
                        })
                    }
                });
            }
            else if (res.status === 200) {
                setSuccessCode(3);
            }
        });
    }

    function canSignUp(signUpInfo: signUpInfo) {
        if (signUpInfo.firstName.length > 0 && signUpInfo.lastName.length > 0 && signUpInfo.email.length > 0 && signUpInfo.password.length > 0 && signUpInfo.confirmPassword.length > 0 && signUpInfo.phoneNumber.length > 0 && signUpInfo.address.length > 0) {
            if (signUpInfo.password == signUpInfo.confirmPassword) {
                if (!cardDetailsOpen) return true;
                if (signUpInfo.cardNumber.length > 0 && signUpInfo.cardName.length > 0 && signUpInfo.cardExpiration.length > 0 && signUpInfo.cardCVC.length > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    return (
        <>
            {successCode != 1 ? //If the user has not successfully signed up
                <form noValidate >
                    <div className='lg:flex'>
                        <div id='topField' className='flex flex-col space-y-6 p-4 mb-4 w-full'>
                            <TextField id='email' name="email" variant='standard' type="email" label='Email *' value={signUpInfo.email} onChange={handleSignUpChange}></TextField>
                            <div className='flex w-full'>
                                <TextField name="firstName" className='w-full mr-1' variant='standard' type="text" label='First Name *' value={signUpInfo.firstName} onChange={handleSignUpChange}></TextField>
                                <TextField name="lastName" className='w-full' variant='standard' type="text" label='Last Name *' value={signUpInfo.lastName} onChange={handleSignUpChange}></TextField>
                            </div>
                            <TextField name="phoneNumber" variant='standard' type="text" label='Phone Number *' value={signUpInfo.phoneNumber} onChange={handleSignUpChange}></TextField>
                            <TextField name="address" variant='standard' type="text" label='Address' value={signUpInfo.address} onChange={handleSignUpChange}></TextField>
                            <TextField name="password" variant='standard' type="password" label='Password *' onChange={handleSignUpChange}></TextField>
                            <TextField name="confirmPassword" variant='standard' type="password" label='Confirm Password *' onChange={handleSignUpChange}></TextField>

                        </div>

                        <div id='botField' className={cardDetailsOpen ? "block w-full" : "hidden"}>
                            {/* <Divider className='lg:float-left' orientation={
                            screen?.width >= 1024 ? "vertical" : "horizontal"
                            } /> */}
                            <div className='flex flex-col space-y-6 p-4 mb-4'>
                                <TextField name="cardName" variant='standard' type="text" label='Cardholder Name' value={signUpInfo.cardName} onChange={handleSignUpChange}></TextField>
                                <TextField name='cardNumber' variant='standard' type="text" label='Card Number' value={signUpInfo.cardNumber} onChange={handleSignUpChange}></TextField>
                                <DatePicker views={['year', 'month']}
                                    label="Year and Month"
                                    minDate={dayjs()}
                                    maxDate={dayjs().add(10, 'year')}
                                    value={expirationDate}
                                    onChange={(newValue) => {
                                        setExpirationDate(newValue);
                                        setSignUpInfo({
                                            ...signUpInfo,
                                            cardExpiration: newValue?.format('MM/YY')
                                        } as signUpInfo);
                                    }}
                                    renderInput={(params) => <TextField {...params} variant='standard' helperText={null} />}
                                />
                                <TextField name="cardCVC" variant='standard' type="text" label='CVC' value={signUpInfo.cardCVC} onChange={handleSignUpChange}></TextField>
                            </div>
                        </div>
                    </div>
                    <FormControlLabel className="text-text-light" control={<Checkbox checked={signUpInfo.promotionsSubscribed} onChange={handlePromotionToggle} />} label="Subscribe To promotions?" />
                    <Button className='w-full my-2' onClick={handleOpenCard}> {cardDetailsOpen ? "Not Right Now" : "Add a Payment Method"}</Button>
                    {successCode == 3 ? <p className='text-red-500'>Email already in use</p> : null}
                    {successCode == 4 ? <p className='text-red-500'>Error adding card</p> : null}
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


export function UpdateProfileForm({ user }: { user: User }) {
    const [successCode, setSuccessCode] = useState(0); // 0 - waiting for submit, 1 - Success, 2- Wrong Current Password, 3 - Server Error
    const [updateProfileInfo, setUpdateProfileInfo] = useState<updateProfileInfo>({
        name: user?.name,
        lastname: user?.lastname,
        currentPassword: '',
        password: '',
        address: user?.address,
        promotionSubscribed: user?.promotionSubscribed || false,
    } as updateProfileInfo);

    function handleProfileUpdate(event: React.ChangeEvent<HTMLInputElement>) {
        setUpdateProfileInfo({
            ...updateProfileInfo,
            [event.target.name]: event.target.value
        } as updateProfileInfo);
    }

    function getUrlFromJSON(json: updateProfileInfo) {
        //add &promotionsSubscribed=${updateProfileInfo.promotionSubscribed}`; to the end of this eventually
        let url = `${serverUrl}/edit-profile?email=${user?.email}&name=${updateProfileInfo.name}&lastname=${updateProfileInfo.lastname}&address=${updateProfileInfo.address}`;
        if (updateProfileInfo.password != '') {
            url += `&password=${updateProfileInfo.password}`;
        }
        return url;
        // let key: keyof updateProfileInfo;
        // for (key in json) {
        //     console.log('Keys: ', key)
        //     if (json[key] != 'email' && json[key] != 'currentPassword') {
        //         if (json[key] != null) {
        //             url += `&${key}=${json[key]}`;
        //         }
        //     }
        //     return url;
        // }
    }

    function handlePromotionToggle() {
        setUpdateProfileInfo({
            ...updateProfileInfo,
            promotionSubscribed: !updateProfileInfo.promotionSubscribed
        });
    }

    function sendNewPassword() {
        if (user?.password == updateProfileInfo.currentPassword) {
            fetch(getUrlFromJSON(updateProfileInfo), {
                method: 'PUT',
                body: JSON.stringify(updateProfileInfo)
            }).then((response) => {
                if (response.status == 200) {
                    return response.json();
                }
                return null;
            }).then((data) => {
                if (data == null) {
                    setSuccessCode(3);
                    return
                }
                setSuccessCode(1);
            });
        } else {
            setSuccessCode(2);
        }
    }

    return (
        <form className='flex flex-col space-y-6 p-4 mb-4 w-full'>
            <TextField variant='standard' type="email" label='Email' value={user?.email} InputProps={{ readOnly: true }}></TextField>
            <TextField variant='standard' name='name' label='First Name' value={updateProfileInfo.name} onChange={handleProfileUpdate}></TextField>
            <TextField variant='standard' name='lastname' label='Last Name' value={updateProfileInfo.lastname} onChange={handleProfileUpdate}></TextField>
            <TextField variant='standard' name='address' label='Address' value={updateProfileInfo.address} onChange={handleProfileUpdate}></TextField>
            <TextField variant='standard' type="password" label='Current Password' name="currentPassword" value={updateProfileInfo.currentPassword} onChange={handleProfileUpdate}></TextField>
            <TextField variant='standard' type="password" label='New Password' name="password" value={updateProfileInfo.password} onChange={handleProfileUpdate}></TextField>
            <FormControlLabel className="text-text-light" control={<Checkbox checked={updateProfileInfo.promotionSubscribed} onChange={handlePromotionToggle} />} label="Recieve Promotion?" />
            <Button className="bg-primary w-full font-extrabold my-3" variant='contained' onClick={sendNewPassword}>Update Profile</Button>
            {successCode == 1 ? <h3 className='text-xl font-extrabold text-green-600'>Updated Successfully</h3> : null}
            {successCode == 2 ? <h3 className='text-xl font-extrabold text-red-600'>Current Password is incorrect</h3> : null}
            {successCode == 3 ? <h3 className='text-xl font-extrabold text-red-600'>Server Error</h3> : null}
        </form>

    );
}

export function AddPaymentForm({ user }: { user: User }) {

    const [successCode, setSuccessCode] = useState(0); // 0 - waiting for submit, 1 - Success, 2 - Server Error
    const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
    const [addPaymentInfo, setAddPaymentInfo] = useState<addPaymentInfo>({
        cardName: '',
        cardNumber: '',
        cardExpiration: '',
        cardCVC: '',
    } as addPaymentInfo);

    function handleFormChange(event: React.ChangeEvent<HTMLInputElement>) {
        setAddPaymentInfo({
            ...addPaymentInfo,
            [event.target.name]: event.target.value
        } as addPaymentInfo);
    }

    function handleSubmit() {
        fetch(`${serverUrl}/payment-card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //Add CVC here
            body: JSON.stringify({ paymentNum: addPaymentInfo.cardNumber, userID: user?.userID, expDate: addPaymentInfo.cardExpiration })
        }).then(res => {
            if (res.status == 200) {
                console.log('Card Added', addPaymentInfo);
                setSuccessCode(1);
                return res.json();
            } else {
                setSuccessCode(2);
            }
        })
    }

    return (
        <form className='flex flex-col space-y-6 p-4 mb-4'>
            <TextField name="cardName" variant='standard' type="text" label='Cardholder Name' value={addPaymentInfo.cardName} onChange={handleFormChange}></TextField>
            <TextField name="cardNumber" variant='standard' type="text" label='Card Number' value={addPaymentInfo.cardNumber} onChange={handleFormChange}></TextField>
            <DatePicker views={['year', 'month']}
                label="Year and Month"
                minDate={dayjs()}
                maxDate={dayjs().add(10, 'year')}
                value={expirationDate}
                onChange={(newValue) => {
                    setExpirationDate(newValue);
                    setAddPaymentInfo({
                        ...addPaymentInfo,
                        cardExpiration: newValue?.format('MM/YY')
                    } as addPaymentInfo);
                }}
                renderInput={(params) => <TextField {...params} variant='standard' helperText={null} />}
            />
            <TextField name="cardCVC" variant='standard' type="text" label='CCV' value={addPaymentInfo.cardCVC} onChange={handleFormChange}></TextField>
            <Button className="bg-primary w-full font-extrabold my-3" variant='contained' onClick={handleSubmit}>Submit</Button>
            {successCode == 1 ? <h3 className='text-xl font-extrabold text-green-600'>Card Added Successfully Please refresh the page</h3> : null}
            {successCode == 2 ? <h3 className='text-xl font-extrabold text-red-600'>Server Error</h3> : null}
        </form>
    );
}

export function ResetEmailForm() {
    const [email, setEmail] = useState('');
    const [successCode, setSuccessCode] = useState(0); // 0 - waiting for submit, 1 - Success, 2 - Server Error, 3- Email not found
    function handleFormChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (email != '') {
            fetch(`${serverUrl}/check-user?email=${email}`).then((res) => {
                if (res.status == 200) { //If Email is found
                    fetch(`${serverUrl}/reset-password`, { //Send reset password email
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email: email })
                    }).then((res) => {
                        if (res.status == 200) {
                            setSuccessCode(1);
                        } else {
                            setSuccessCode(2);
                        }
                    })
                    return null;
                }
                //If email is not found
                setSuccessCode(3);
                return null;
            });
        }
    }
    return (
        <form noValidate className='flex flex-col space-y-6 p-4' onSubmit={handleSubmit}>
            <TextField id='emailInput' variant='standard' type="email" label='Email' value={email} onChange={handleFormChange}></TextField>
            <Button className='bg-primary m-4 mt-8 font-extrabold ' variant='contained' type='submit'>Send Reset Email</Button>
            {successCode == 1 ? <h3 className='text-xl font-extrabold text-green-600'>Email Sent Successfully</h3> : null}
            {successCode == 2 ? <h3 className='text-xl font-extrabold text-red-600'>Server Error</h3> : null}
            {successCode == 3 ? <h3 className='text-xl font-extrabold text-red-600'>Email not found</h3> : null}
        </form>
    );
}

export function ResetPasswordForm({ token }: { token: string }) {
    const [successCode, setSuccessCode] = useState(0); // 0 - waiting for submit, 1 - Success, 2 - Passwords don't match, 3 - Server Error
    const [resetPasswordInfo, setResetPasswordInfo] = useState<resetPasswordInfo>({
        password: '',
        confirmPassword: '',
    } as resetPasswordInfo);

    function handleFormChange(event: React.ChangeEvent<HTMLInputElement>) {
        setResetPasswordInfo({
            ...resetPasswordInfo,
            [event.target.name]: event.target.value
        } as resetPasswordInfo);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (resetPasswordInfo.password == resetPasswordInfo.confirmPassword) {
            fetch(`${serverUrl}/reset-password?token=${token}`)
            .then((res) => {
                if (res.status == 200) {
                    setSuccessCode(1);
                    console.log("Response", res);
                    return res.text();
                } else {
                    setSuccessCode(3);
                    return;
                }
            })
            .then((data) => { //Data holds the email in a string
                fetch(`${serverUrl}/edit-profile?email=${data}&password=${resetPasswordInfo.password}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then((res) => {
                    if (res.status == 200) {
                        setSuccessCode(1);
                    } else {
                        setSuccessCode(3);
                    }
                })
            });
        } else {
            setSuccessCode(2);
        }
    }

    return (
        <form className='flex flex-col space-y-6 p-4' onSubmit={handleSubmit}>
            <TextField name='password' variant='standard' type="password" label='New Password' value={resetPasswordInfo.password} onChange={handleFormChange}></TextField>
            <TextField name='confirmPassword' variant='standard' type="password" label='Confirm New Password' value={resetPasswordInfo.confirmPassword} onChange={handleFormChange}></TextField>
            {successCode == 1 ? <h3 className='text-xl font-extrabold text-green-600'>Password Reset Successfully</h3> : null}
            {successCode == 2 ? <h3 className='text-xl font-extrabold text-red-600'>Passwords do not match</h3> : null}
            {successCode == 3 ? <h3 className='text-xl font-extrabold text-red-600'>Server Error</h3> : null}
            {successCode == 1 ? 
                <Link href='/login'>
                    <Button className='bg-primary m-4 mt-8 font-extrabold ' variant='contained' type='submit'>Login</Button>
                </Link>
                :
                <Button className='bg-primary m-4 mt-8 font-extrabold ' variant='contained' type='submit'>Reset Password</Button>
            }
        </form>
    );
}