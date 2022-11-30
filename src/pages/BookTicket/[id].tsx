import Head from 'next/head';
import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout';
import { getMovie, Movie } from '../../utils/movie';
import Image from 'next/future/image';
import { myLoader } from '../../utils/image';
//stepper stuffs
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Divider, TextField } from '@mui/material';
import SeatPicker from '../../components/seatPicker';
import { Box, Button, Modal, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { serverUrl } from '../../utils/backendInfo';
import { Show, getShowsByMovieID } from '../../utils/show';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { clientSeat, getAllBookedSeats, getSeatCount } from '../../utils/seat';
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
    //const movie = getMovie(parseInt(params.id));
    const movie = await getMovie(parseInt(params.id));
    return {
        props: {
            movie,
        },
        revalidate: 10,
    };
}

export async function getStaticPaths() {
    const res = await fetch(`${serverUrl}/movie?idsOnly`);
    const data = await res.json();
    const paths = data.map((movie: Movie) => {
        return {
            params: { id: movie.movieID.toString() },
        };
    });
    return {
        paths,
        fallback: 'blocking',
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
    const [shows, setShows] = useState<Show[]>([]);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);


    //Seats stuff
    const [seats, setSeats] = useState<clientSeat[]>([]);
    const [bookedIndexs, setBookedIndexs] = useState<number[]>([]);
    const [seatCount, setSeatCount] = useState(0);
    const [seatsLeft, setSeatsLeft] = useState(adultTickets + childTickets);


    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        console.log("Seats", seats);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    //update seats left when ticket count changes
    useEffect(() => {
        setSeatsLeft(adultTickets + childTickets);
    }, [adultTickets, childTickets]);
   
    //update shows on movie change
    useEffect(() => {
        getShowsByMovieID(movie.movieID).then((shows) => {
            setShows(shows);
            console.log(shows);
        }).catch((err) => {
            console.log(err);
        });
    }, [movie]);


    //update seats on show change
    useEffect(() => {
        if (selectedShow) { // A show was passed in
            //Get however many seats there are in the show's showroom
            //get Correct seat count
            getSeatCount(selectedShow.showroomID).then((count) => {
                setSeatCount(count);
            }).catch((err) => {
                console.log(err);
            })
            //Populate booked seats
            getAllBookedSeats(selectedShow.showID).then((bookedSeats) => {
                const bookedIndexs = bookedSeats.map((seat) => seat.seatNumber);
                setBookedIndexs(bookedIndexs);
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [selectedShow]);

    //update seats on seat count change
    useEffect(() => {
        //Create seats
        const seats: clientSeat[] = [];
        for (let i = 0; i < seatCount; i++) {
            seats.push({
                seatNumber: i,
                showID: selectedShow?.showID || 0,
                booked: bookedIndexs.includes(i),
                selected: false
            })
        }
        setSeats(seats);
    }, [seatCount, bookedIndexs, selectedShow]);

    function selectSeat(seatNum: number) {
        if(seatsLeft > 0) {
            const newSeats = seats.map((seat) => {
                if (seat.seatNumber === seatNum) {
                    return {
                        ...seat,
                        selected: !seat.selected
                    }
                } else {
                    return seat;
                }
            })
            setSeats(newSeats);
            setSeatsLeft(seatsLeft - 1);
            console.log("Seats Left", seatsLeft);
        }
    }

    function deselectSeat( seatNum: number) {
        const newSeats = seats.map((seat) => {
            if (seat.seatNumber === seatNum) {
                return {
                    ...seat,
                    selected: false
                }
            } else {
                return seat;
            }
        });
        setSeats(newSeats);
        setSeatsLeft(seatsLeft + 1);
        console.log("Seats Left", seatsLeft);
    }

    function getShowTimes(date: string): string[] {
        const showTimes: string[] = [];
        shows.forEach((show) => {
            const splitShowTime = show.movieTime.split(" ");
            if (splitShowTime[0] === date) {
                showTimes.push(splitShowTime[1] || "");
            }
        });
        return showTimes;
    }

    //eslint-disable-next-line
    const handleSelectChange = (event: SelectChangeEvent<any>, callFunction: React.Dispatch<React.SetStateAction<any>>) => {
        callFunction(event.target.value);
    }

    function getStepContent(step: number) {
        switch (step) {
            case 0: //----------------------------------------------------------------------------------------------------------------PICK DATE
                return (
                    <div className="flex flex-wrap  justify-center p-5">
                        <CalendarPicker date={date} className="bg-bg-dark m-5 mt-3 rounded-xl shadow-xl text-text-light border-[1px] border-primary" onChange={(newDate) => setDate(newDate)}
                            renderDay={(day, value, dayComponentProps) => {
                                const dayIsBooked = getShowTimes(day.format("MM/DD/YYYY")).length > 0;
                                return (
                                    <>
                                    {dayIsBooked ?  <PickersDay {...dayComponentProps} key={day.format('DD/MM/YYYY')} className="font-extrabold" /> : <PickersDay {...dayComponentProps} key={day.format('DD/MM/YYYY')} disabled />}
                                    </>
                                );
                            }}
                        />
                        <div className='flex flex-col'>
                            <h3 className='text-xl text-primary font-extrabold'> Available Times</h3>
                            <Divider />
                            <ul>
                                {getShowTimes(date?.format("MM/DD/YYYY") || "").map((time) => {
                                    return (
                                        <li key={time} className='text-text-light hover:text-primary cursor-pointer'>{time}</li>
                                    );
                                })}
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
                                    onChange={(event) => { //When the select is changed
                                        handleSelectChange(event, setShowTime)
                                        setSelectedShow(shows.find((show) => show.movieTime === `${date?.format("MM/DD/YYYY")} ${event.target.value}`) || null);
                                    }}
                                >
                                    {getShowTimes(date?.format("MM/DD/YYYY") || "").map((time) => {
                                        return (
                                            <MenuItem key={time} value={time}>{time}</MenuItem>
                                        );
                                    })}
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
                        <SeatPicker seats={seats} seatsLeft={seatsLeft} handleSelect={selectSeat} handleDeselect={deselectSeat}/>
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


    function canStepForward() {
        switch (activeStep) {
            case 0:
                return true;
            case 1:
                return adultTickets + childTickets > 0 && selectedShow !== null;
            case 2:
                return seatsLeft == 0;
            case 3:
                return true;
            default:
                return false;
        }
    }
    return (
        <Layout>
            <Head>
                <title>Book {movie.title}</title>
            </Head>
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
                    <div className='hidden md:block'>
                        <p className='text-text-light'>{movie.synopsis}</p>
                    </div>
                    <Button variant='contained' className='bg-primary' onClick={handleModalOpen}> More Information</Button>
                </div>

            </div>
            {shows.length > 0 ? 
                //If there are showtimes
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
                            disabled={!canStepForward()}
                            onClick={handleNext}
                            variant="outlined"
                            className=""
                        >{activeStep >= 3 ? "Place Order" : "Next"}</Button>
                    </div>
                </div>

                : 
                
                
                
                // IF no showtimes could be found
                <div className='flex flex-col justify-center items-center'>
                    <h2 className='text-center text-2xl font-extrabold text-primary'>No Shows Available</h2>
                    <Divider />
                    <p className='text-center text-text-light'>There are no shows available for this movie at this time.</p>
                </div>
            }


            {/* /Modal that shows movie informatino */}
            <Modal
                open={open}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} className='text-text-light border-primary border-2 rounded-xl bg-bg-dark w-[400px] lg:w-[800px] p-0'>
                    <div className="flex justify-between items-center m-3">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {movie.title} Detials
                        </Typography>
                        <IconButton className='' onClick={handleModalClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className="h-full max-h-[80vh] overflow-y-auto m-3 mr-1">
                        <div className="flex justify-center">
                            <iframe width="560" height="315" src={movie.video} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                        <div className="flex flex-col">
                            <h2 className='text-2xl font-extrabold text-primary text-center'>Movie Information</h2>
                            <Divider />
                            <div className="font-extrabold text-xl text-primary grid grid-cols-2  gap-y-24 p-4">
                                <div className='flex flex-col justify-center items-start col-span-2'>
                                    <h2>Synopsis:</h2>
                                    <p className='ml-2 font-normal text-white text-base'>{movie.synopsis}</p>
                                </div>
                                <div className='flex flex-col justify-center items-start'>
                                    <h2 >Title:</h2>
                                    <p className='ml-2 font-normal text-white text-base'>{movie.title}</p>
                                </div>
                                <div className='flex flex-col justify-center items-start'>
                                    <h2 >Director:</h2>
                                    <p className='ml-2 font-normal text-white text-base'>{movie.director}</p>
                                </div>
                                <div className='flex flex-col justify-center items-start'>
                                    <h2 >Producer:</h2>
                                    <p className='ml-2 font-normal text-white text-base'>{movie.producer}</p>
                                </div>
                                <div className='flex flex-col justify-center items-start'>
                                    <h2 >Cast:</h2>
                                    <p className='ml-2 font-normal text-white text-base'>{movie.cast}</p>
                                </div>
                                <div className='flex flex-col justify-center items-start'>
                                    <h2 >Rating:</h2>
                                    <p className='ml-2 font-normal text-white text-base'>{movie.ratingCode}</p>
                                </div>
                                <div className='flex flex-col justify-center items-start'>
                                    <h2 >Reviews:</h2>
                                    <p className='ml-2 font-normal text-white text-base'>{movie.reviews}</p>
                                </div>
                                <div className='flex flex-col justify-center items-start'>
                                    <h2>Genres:</h2>
                                    <p className='ml-2 font-normal text-white text-base'>{movie.genre}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <Button variant='contained' className='bg-primary float-right m-4' onClick={handleModalClose}> Close</Button>
                </Box>
            </Modal>
        </Layout>

    )
}
