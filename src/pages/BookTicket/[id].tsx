import Head from 'next/head';
import React, { useState } from 'react'
import Layout from '../../components/layout';
import { getMovie, Movie } from '../../utils/movie';
import Image from 'next/future/image';
import { myLoader } from '../../utils/image';
//stepper stuffs
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Rating from '@mui/material/Rating';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Divider, TextField } from '@mui/material';
import SeatPicker from '../../components/seatPicker';
import { Box, Button, Modal, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface staticProps {
    params: {
        id: string
    }
}

interface BookMovieProps {
    movie: Movie
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    p: 4,
};

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
    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSelectChange = (event: SelectChangeEvent<any>, callFunction: React.Dispatch<React.SetStateAction<any>>) => {
        callFunction(event.target.value);
    }

    function getStepContent(step: number) {
        switch (step) {
            case 0: //----------------------------------------------------------------------------------------------------------------PICK DATE
                return (
                    <div className="flex flex-wrap  justify-center p-5">
                        <CalendarPicker date={date} className="bg-bg-dark m-5 mt-3 rounded-xl shadow-xl text-text-light border-[1px] border-primary" onChange={(newDate) => setDate(newDate)} />
                        <div className='flex flex-col'>
                            <h3 className='text-xl text-primary font-extrabold'> Available Times</h3>
                            <Divider />
                            <ul>
                                <li className='text-text-light cursor-pointer hover:text-primary' onClick={() => setShowTime("12:00 PM")}>12:00 PM</li>
                                <li className='text-text-light cursor-pointer hover:text-primary' onClick={() => setShowTime("3:00 PM")}>3:00 PM</li>
                                <li className='text-text-light cursor-pointer hover:text-primary' onClick={() => setShowTime("6:00 PM")}>6:00 PM</li>
                                <li className='text-text-light cursor-pointer hover:text-primary' onClick={() => setShowTime("9:00 PM")}>9:00 PM</li>
                            </ul>
                        </div>
                    </div>
                );
            case 1://----------------------------------------------------------------------------------------------------------------PICK TICKETS
                return (
                    <div className='mb-[4.3rem] md:mb-0 p-5'>
                        <div className='mx-auto max-w-[300px] bg-bg-dark p-4 rounded-xl border-[1px] border-primary shadow-lg'>
                            <div className='flex items-center mb-3 justify-center'>
                                <h3 className='text-xl text-primary font-extrabold mr-5'>Show times: </h3>
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
                            <div className='flex items-center mb-3 justify-center'>
                                <h3 className='text-xl text-primary font-extrabold mr-5'>Adult Tickets: </h3>
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
                            <div className='flex items-center mb-3 justify-center'>
                                <h3 className='text-xl text-primary font-extrabold mr-5'>Child Tickets: </h3>
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
            case 2: //----------------------------------------------------------------------------------------------------------------PICK SEATS
                return (
                    <div className='flex justify-center mt-5'>
                        <SeatPicker />

                        <div className="flex flex-col text-text-light ml-10">
                            <h3 className='text-center text-xl font-extrabold text-primary'>Seats Left:</h3>
                            <Divider />
                            <p> Adult Tickets: {adultTickets}</p>
                            <p> Child Tickets: {childTickets}</p>
                        </div>
                    </div>

                )
            case 3: //----------------------------------------------------------------------------------------------------------------CHECKOUT
                return (
                    <div className="flex flex-col w-[500px] mx-auto">
                        <h2 className='text-center text-2xl font-extrabold text-primary'>Checkout</h2>
                        <Divider />
                        <div className='flex flex-col justify-center items-center'>
                            <h3 className='text-xl text-primary font-extrabold'>Total Cost: </h3>
                            <p className='text-text-light'>Adult Tickets: ${adultTickets * 10}</p>
                            <p className='text-text-light'>Child Tickets: ${childTickets * 5}</p>
                            <p className='text-text-light'>Total: ${(adultTickets * 10) + (childTickets * 5)}</p>
                        </div>
                        <div className='flex flex-col items-center justify-between'>
                            <div className='flex flex-col items-center justify-between bg-bg-dark w-[90%] min-h-[50px] border-[1px] border-primary rounded-xl shadow-lg mt-2'>
                                <Button className='text-lg font-extrabold text-primary w-full h-full min-h-[50px]'>Use Existing Card</Button>
                            </div>
                            <h2 className='text-center text-3xl font-extrabold text-primary'>Or</h2>
                            <div className='flex flex-col items-center justify-between bg-bg-dark w-[90%] border-[1px] border-primary rounded-xl shadow-lg mt-2 p-2'>
                                <h4 className='text-xl font-extrabold text-primary mb-2'>Enter New info</h4>
                                <TextField id="outlined-basic" size="small" label="Card Number" variant="outlined" className='w-[250px] mb-2' />
                                <div className=" flex w-[250px]">
                                    <TextField id="outlined-basic" size="small" label="Expiration Date" variant="outlined" className='mr-2' />
                                    <TextField id="outlined-basic" size="small" label="CVV" variant="outlined" />
                                </div>
                                <br />
                                <TextField id="outlined-basic" size="small" label="Name on Card" variant="outlined" className='w-[250px] mt-2' />
                                <TextField id="outlined-basic" size="small" label="Billing Address" variant="outlined" className='w-[250px] mt-2' />
                                <TextField id="outlined-basic" size="small" label="Zip Code" variant="outlined" className='w-[250px] mt-2' />

                            </div>
                        </div>
                    </div>
                )
            default: //----------------------------------------------------------------------------------------------------------------Error/Done
                return (
                    <div className='flex flex-col justify-center mt-5'>
                        <h2 className='text-center text-2xl font-extrabold text-primary'> Order Placed</h2>
                        <Divider />
                        <div className='flex flex-col justify-center items-center'>
                            <h3 className='text-xl text-primary font-extrabold'>Ticket information: </h3>
                            <p className='text-text-light'>Adult Tickets: ${adultTickets * 10}</p>
                            <p className='text-text-light'>Child Tickets: ${childTickets * 5}</p>
                            <p className='text-text-light'>Total: ${(adultTickets * 10) + (childTickets * 5)}</p>
                            <p className='text-text-light'>Show Time: {showTime}</p>
                        </div>
                    </div>
                );
        }
    }

    return (
        <Layout>
            <Head>
                <title>Book {movie.title}</title>
            </Head>
            {/* <h1 className='font-extrabold text-4xl text-center leading-loose'>Book Tickets for:</h1> */}
            <div className="flex justify-center p-3">
                <Image src={movie.trailerPic}
                    alt={movie.title}
                    loader={myLoader}
                    width={150}
                    height={100}
                    className={'rounded-lg w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6'}
                />
                <div className="flex flex-col p-3 w-96">
                    <h2 className='font-extrabold text-3xl leading-loose text-primary'>{movie.title}</h2>
                    <Rating name="read-only" value={movie.ratingCode} precision={0.1} readOnly />
                    <div className='hidden md:block'>
                        <p className='text-lg text-gray-500 '>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt laborum sapiente quos cupiditate officiis modi expedita non deleniti eos similique..</p>
                    </div>
                    <Button variant='contained' className='bg-primary' onClick={handleModalOpen}> More Information</Button>
                </div>

            </div>
            <div className='lg:w-2/3 lg:mx-auto p-4 h-full'>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
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
            </div>
            <Modal
                open={open}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} className='text-text-light border-primary border-2 rounded-xl bg-bg-dark w-[400px] lg:w-[800px] p-0'>
                    <div className="flex justify-between items-center m-3">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Movie Information will be here
                        </Typography>
                        <IconButton className='' onClick={handleModalClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className="h-full max-h-[80vh] overflow-y-auto m-3 mr-1">
                        <div className="flex justify-center">
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/JfVOs4VSpmA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <h2 className='text-2xl font-extrabold text-primary'>Movie Information</h2>
                            <Divider />
                            <p className='text-text-dark'>
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque aspernatur, quae laudantium nemo deserunt cum possimus ratione aperiam. Amet aut sequi eos quae ipsam accusantium deserunt assumenda consequatur autem! Sit quod ipsum quo, maxime voluptatibus cum perspiciatis tempora modi assumenda nihil dicta amet ea totam repellendus recusandae quisquam culpa eum dolore numquam ab nulla suscipit reiciendis incidunt aut. Voluptatum officiis saepe porro ratione laudantium nulla veritatis aperiam corrupti minus assumenda et suscipit, dolore ut non recusandae expedita dolorem eius praesentium aliquid itaque facere quibusdam ex nemo! Odio dolore laborum reprehenderit. Sed temporibus in accusamus impedit numquam modi? Voluptatum suscipit voluptates dolore, in libero natus necessitatibus neque temporibus alias labore at ex vel eaque a ipsam eveniet quae nesciunt! Quo maxime quae, eaque doloremque culpa consequatur! Voluptas reiciendis reprehenderit, beatae perspiciatis eaque ea labore quisquam facilis laborum. Cum, vero. Eos quibusdam ipsam reiciendis hic, iusto consectetur possimus perferendis voluptates facere repudiandae molestiae vel autem nisi, alias dolor dolores velit optio magni aliquid? Iusto ea, consectetur quae tempore autem aperiam magnam odit dignissimos cupiditate. Explicabo animi quidem consequatur molestias nisi itaque alias dignissimos perspiciatis rem! Totam, neque, temporibus libero ipsa odit mollitia alias voluptatum similique autem at corrupti, ea iste officiis pariatur dolor amet. Voluptatem et, fugiat vitae eligendi nesciunt vero iure beatae, dolores aliquid est aut praesentium quas alias? Fugiat, quasi. Excepturi quas voluptas perspiciatis sed. Sit sunt ad numquam maiores laboriosam obcaecati nihil tenetur omnis veniam. Aliquam ea, cum eaque consequatur provident totam fugiat modi libero tempora unde culpa ullam praesentium laboriosam doloremque deserunt? Laboriosam cupiditate nulla, ab fugit quasi architecto ullam, numquam praesentium consectetur magnam ad officiis dolorum a obcaecati veniam assumenda rem asperiores quis sed voluptatum vitae sequi eveniet quam nemo? Ducimus ab odio deleniti autem beatae dolores qui. Voluptatem dolores natus accusantium quia vel, pariatur porro minima!
                            </p>
                        </div>
                    </div>
                    <Button variant='contained' className='bg-primary float-right m-4' onClick={handleModalClose}> Close</Button>
                </Box>
            </Modal>
        </Layout>

    )
}
