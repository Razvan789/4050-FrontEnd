import { Main } from 'next/document';
import Head from 'next/head';
import React, { useState } from 'react'
import Layout from '../../components/layout';
import { getMovie, Movie } from '../../utils/movie';
import { User } from '../../utils/user';
import Image from 'next/future/image';
import { myLoader } from '../../utils/image';
//stepper stuffs
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

interface staticProps {
    params: {
        id: string
    }
}

interface BookMovieProps {
    movie: Movie
}



export async function getStaticProps({ params }: staticProps) {
    const movie = getMovie(parseInt(params.id));
    return {
        props: {
            movie,
        },
    };
}

export async function getStaticPaths() {
    const paths = [{ params: { id: "1" } }];
    return {
        paths,
        fallback: false,
    };
}

const steps = ['Select Date', 'Select Tickets', 'Pick Seats', 'Checkout'];


export default function BookMovie({ movie }: BookMovieProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());
    const [adultTickets, setAdultTickets] = React.useState(0);
    const [childTickets, setChildTickets] = React.useState(0);
    const [showTime, setShowTime] = React.useState("Select Time");
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSelectChange = (event: SelectChangeEvent<string | number>, callFunction: React.Dispatch<React.SetStateAction<string | number>>) => {
        callFunction(event.target.value);
    }

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return (
                    <CalendarPicker date={date} className="bg-slate-900 mt-3 rounded-xl shadow-xl text-white border-[1px] border-purple-300" onChange={(newDate) => setDate(newDate)} />
                );
            case 1:
                return (
                    <div className='mb-[7rem] md:mb-0'>
                        <h2 className='text-center text-2xl font-extrabold text-purple-300'></h2>
                        <div className='mx-auto w-fit my-5'>
                            <div className='flex items-center mb-3'>
                                <h3 className='text-xl text-purple-300 font-extrabold mr-5'>Show times: </h3>
                                <Select
                                    value={showTime}
                                    onChange={(event) => handleSelectChange(event, setShowTime)}
                                >
                                    <MenuItem value="6:00pm">6:00pm</MenuItem>
                                    <MenuItem value="7:00pm">7:00pm</MenuItem>
                                    <MenuItem value="8:00pm">8:00pm</MenuItem>
                                    <MenuItem value="9:00pm">9:00pm</MenuItem>
                                    <MenuItem value="10:00pm">10:00pm</MenuItem>
                                </Select>
                            </div>
                            <div className='flex items-center mb-3'>
                                <h3 className='text-xl text-purple-300 font-extrabold mr-5'>Adult Tickets: </h3>
                                <Select
                                    value={adultTickets}
                                    onChange={(event) => handleSelectChange(event, setAdultTickets)}
                                    label=""
                                >
                                    <MenuItem value={0}>0</MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            </div>
                            <div className='flex items-center mb-3'>
                                <h3 className='text-xl text-purple-300 font-extrabold mr-5'>Child Tickets: </h3>
                                <Select
                                    value={childTickets}
                                    onChange={(event) => handleSelectChange(event, setChildTickets)}
                                    label=""
                                >
                                    <MenuItem value={0}>0</MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (<h2 className='text-center font-extrabold text-2xl text-purple-300'>
                    Pick Seats
                </h2>)
            case 3:
                return (<h2 className='text-center text-2xl font-extrabold text-purple-300'>
                    Checkout
                </h2>)
            default:
                return <h2 className='text-center text-2xl font-extrabold text-purple-300'> Order Placed</h2>;
        }
    }

    return (

        <Layout>
            <Head>
                <title>Book {movie.title}</title>
            </Head>
            {/* <h1 className='font-extrabold text-4xl text-center leading-loose'>Book Tickets for:</h1> */}
            <div className="flex justify-center p-3">
                <Image src={movie.image}
                    alt={movie.title}
                    loader={myLoader}
                    width={150}
                    height={100}
                    className={'rounded-lg w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6'}
                />
                <div className="flex flex-col p-3 w-96">
                    <h2 className='font-extrabold text-3xl leading-loose text-purple-300'>{movie.title}</h2>
                    <Rating name="read-only" value={movie.rating} precision={0.1} readOnly />
                    {/* <p className='text-sm text-gray-500 '>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt laborum sapiente quos cupiditate officiis modi expedita non deleniti eos similique..</p> */}
                </div>

            </div>
            <div className='lg:w-2/3 lg:mx-auto p-4 h-full'>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <div className='h-full'>
                    {getStepContent(activeStep)}
                </div>
            </div>
            <div className='flex justify-between p-4'>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    className=""
                >Back</Button>
                <Button
                    disabled={activeStep === steps.length}
                    onClick={handleNext}
                    variant="outlined"
                    className=""
                >{activeStep >= 3 ? "Place Order" : "Next"}</Button>
            </div>
        </Layout>

    )
}
