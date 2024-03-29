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
import Select, { SelectChangeEvent, selectClasses } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Divider, TextField } from '@mui/material';
import SeatPicker from '../../components/seatPicker';
import { Box, Button, Modal, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { serverUrl } from '../../utils/backendInfo';
import { Show, getShowsByMovieID } from '../../utils/show';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { clientSeat, getAllBookedSeats, getSeatCount, addSeats } from '../../utils/seat';
import { useUser } from '../../utils/user';
import { useRouter } from 'next/router';
import { TicketType, getTicketTypes } from '../../utils/tickettype';
import { addBooking, Booking } from '../../utils/booking';
import { Promo, getPromoByCode } from '../../utils/promo';
import { PaymentCard, getPaymentCardByUserID } from '../../utils/paymentcard';
import { CheckPromoForm } from '../../components/forms';
import { Ticket, addTicket } from '../../utils/ticket';

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


//LEFT TO DO
// 1. Checkout form
// 2. Select card from list
// 3. Enter Promo Code
// 4. Create a booking object to send to backend
export default function BookMovie({ movie }: BookMovieProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());
    const [adultTickets, setAdultTickets] = React.useState(0);
    const [childTickets, setChildTickets] = React.useState(0);
    const [showTime, setShowTime] = React.useState("Select Time");
    const [open, setOpen] = useState(false);
    const [modalToShow, setModalToShow] = useState(1); // 0 - Movie info, 1 - Cards
    const [shows, setShows] = useState<Show[]>([]);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);

    const [bookingStatus, setBookingStatus] = useState(0); //0 - not booked, 1 - booked, 2 - error
    const [booking, setBooking] = useState<Booking>({
        showID: 0,
        customerID: 0,
        total: 0,
        paymentID: 0,
    });
    const user = useUser();
    const router = useRouter();

    //Seats stuff
    const [seats, setSeats] = useState<clientSeat[]>();
    const [bookedIndexs, setBookedIndexs] = useState<number[]>([]);
    const [seatCount, setSeatCount] = useState(0);
    const [seatsLeft, setSeatsLeft] = useState(0);


    //Ticket Stuff
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);


    //Promo stuff
    const [promo, setPromo] = useState<Promo | null>(null);
    const [promoStatus, setPromoStatus] = useState(0); //0- Waiting 1- Valid 2- Invalid

    //Payment card stuff
    const [selectedCardID, setSelectedCardID] = useState(-2);
    const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
    const [cardStatus, setCardStatus] = useState(0); //0- none selected, 1 - selected

    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const handleNext = () => {
        if (activeStep === 3) {
            //Checkout
            submitBooking();
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    //Update Booking
    useEffect(() => {
        if (selectedShow) {
            const newBooking: Booking = {
                ...booking,
                showID: selectedShow?.showID,
                total: Math.round(ticketTypes.reduce((acc, ticketType) => acc + ticketType.price * ticketType.ticketCount, 0) * (1.06) *(1 - (promo?.percentage || 0)) * 100) / 100,
                customerID: user?.userID || -1,
                promoID: promo?.promoID,
                paymentID: selectedCardID,
            };
            setBooking(newBooking);
        }
    }, [selectedShow, promo, ticketTypes, user, selectedCardID]);
    //On Page load could be done earlier then cached but oh well
    useEffect(() => {
        getTicketTypes().then(data => {
            setTicketTypes(data);
        });
        getPaymentCardByUserID(user?.userID).then(data => {
            setPaymentCards(data);
        })
    }, [user]);

    //update seats left when ticket count or seats changes
    useEffect(() => {
        const seatsSelected = seats?.filter(seat => seat.selected).length || 0;
        setSeatsLeft(ticketTypes.reduce((acc, ticketType) => {
            return acc + ticketType.ticketCount;
        }, 0) - seatsSelected);
    }, [ticketTypes, seats]);

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
        for (let i = 1; i < seatCount; i++) {
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
        if (seatsLeft > 0) {
            const newSeats = seats?.map((seat) => {
                if (seat.seatNumber == seatNum) {
                    return {
                        ...seat,
                        selected: true
                    }
                } else {
                    return seat;
                }
            })
            setSeats(newSeats);
            console.log("Seats Left", seatsLeft);
        }
    }

    function deselectSeat(seatNum: number) {
        const newSeats = seats?.map((seat) => {
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

    function handlePromoCheck(promoCode: string) {
        if (promoCode.length > 0) {
            setPromoStatus(0);
            getPromoByCode(promoCode).then((promo) => {
                if (promo) {
                    setPromo(promo);
                    setPromoStatus(1);
                } else {
                    setPromoStatus(2);
                }
            }).catch((err) => {
                console.log(err);
                setPromoStatus(2);
            })
        }
    }
    //eslint-disable-next-line
    const handleSelectChange = (event: SelectChangeEvent<any>, callFunction: React.Dispatch<React.SetStateAction<any>>) => {
        callFunction(event.target.value);
    }

    function updateTicketCount(ticketID: number, count: number) {
        console.log("Changing ticket count", ticketID, count);
        console.log("Ticket Types", ticketTypes);
        if (count == NaN || count < 0) count = 0;
        const newTicketTypes = ticketTypes.map((ticketType) => {
            if (ticketType.typeID === ticketID) {
                return {
                    ...ticketType,
                    ticketCount: count
                }
            } else {
                return ticketType;
            }
        });
        setTicketTypes(newTicketTypes);
    }

    function selectCard(cardID: number) {
        setSelectedCardID(cardID);
        setCardStatus(1);
    }

    function submitBooking() {
        const selectedSeats = seats?.filter((seat) => seat.selected) || [];
        //Add Seats to DB return those seats
        addSeats(selectedSeats).then((seats) => {
            //Add booking to DB
            addBooking(booking).then((booking) => {
                //Add tickets to DB return those tickets
                seats.forEach((seat) => {
                    addTicket({
                        seatID: seat.seatID || -1,
                        bookingID: booking.bookingID || -1,
                        typeID: 1,
                    }).then(() => { setBookingStatus(1) }).catch((err) => { setBookingStatus(2); console.log(err) });
                });
            }).catch((err) => { setBookingStatus(2); console.log(err) });
        }).catch((err) => { setBookingStatus(2); console.log(err) });
    }

    function canStepForward() {
        switch (activeStep) {
            case 0:
                return true;
            case 1:
                let toReturn = false;
                ticketTypes.forEach((ticketType) => {
                    if (ticketType.ticketCount != 0) {
                        console.log('ticket count is 0')
                        toReturn = true;
                    }
                })
                return selectedShow !== null && toReturn;
            case 2:
                return seatsLeft == 0;
            case 3:
                return booking?.paymentID != -2;
            default:
                return false;
        }
    }


    function getStepContent(step: number) {
        switch (step) {
            case 0: //----------------------------------PICK DATE
                return (
                    <div className="flex flex-wrap-reverse  justify-center p-5">
                        <CalendarPicker date={date} className="bg-bg-dark m-5 mt-3 rounded-xl shadow-xl text-text-light border-[1px] border-primary" onChange={(newDate) => setDate(newDate)}
                            renderDay={(day, value, dayComponentProps) => {
                                const dayIsBooked = getShowTimes(day.format("MM/DD/YYYY")).length > 0;
                                return (
                                    <>
                                        {dayIsBooked ? <PickersDay {...dayComponentProps} key={day.format('DD/MM/YYYY')} className="font-extrabold" /> : <PickersDay {...dayComponentProps} key={day.format('DD/MM/YYYY')} disabled />}
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
            case 1://-----------------------------------PICK TICKETS
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
                            {ticketTypes.map((ticketType) => {
                                return (
                                    <div key={ticketType.typeID} className='grid grid-cols-2 items-center mb-5'>
                                        <h1 className='text-xl text-center text-primary'>{ticketType.type}:</h1>
                                        <TextField className='max-w-[70px]' type="number" value={ticketType.ticketCount} onChange={(event) => { updateTicketCount(ticketType.typeID || -1, parseInt(event.target.value)) }} />
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                )
            case 2: //----------------------------------PICK SEATS
                return (
                    <div className='flex justify-center mt-5'>
                        <SeatPicker seats={seats || []} seatsLeft={seatsLeft} handleSelect={selectSeat} handleDeselect={deselectSeat} />
                    </div>

                )
            case 3: //----------------------------------CHECKOUT
                return (
                    <>
                        {user?.email ?
                            <div className="flex flex-col min-w-[380px] max-w-[500px] mx-auto">
                                <h2 className='text-center text-2xl font-extrabold text-primary'>Checkout</h2>
                                <Divider />
                                <div className='flex flex-col justify-center items-center'>
                                    {ticketTypes.map((ticketType) => {
                                        return (
                                            <div key={ticketType.typeID} className='flex mb-3 justify-center'>
                                                <h3 className='text-lg text-text-light font-extrabold mr-1'>{ticketType.type}: </h3>
                                                <h3 className='text-lg text-text-light font-extrabold'>${ticketType.price * ticketType.ticketCount}</h3>
                                            </div>
                                        )
                                    })
                                    }
                                    <p className='text-2xl font-extrabold text-primary mb-5'>Total with Tax: <span className='text-text-light'>${booking.total}</span></p>
                                </div>
                                <div className='flex flex-col items-center justify-between'>
                                    <div className='flex flex-col items-center justify-between bg-bg-dark w-[90%] min-h-[50px] border-[1px] border-primary rounded-xl shadow-lg mt-2'>
                                        <Button className='text-lg font-extrabold text-primary w-full h-full min-h-[50px]' onClick={() => { handleModalOpen(); setModalToShow(1) }}>{selectedCardID == -1 || selectedCardID == -2 ? "Use Existing Card" : `Using Card ${selectedCardID} Click to change`}</Button>
                                    </div>
                                    {selectedCardID == -1 || selectedCardID == -2 ? // No selected card
                                        <>
                                            <h2 className='text-center text-3xl font-extrabold text-primary'>Or</h2>
                                            <div className='flex flex-col items-center justify-between bg-bg-dark w-[90%] border-[1px] border-primary rounded-xl shadow-lg mt-2 p-2'>
                                                <h4 className='text-xl font-extrabold text-primary mb-2'>Enter New info</h4>
                                                <TextField id="outlined-basic" size="small" label="Card Number" variant="outlined" className='w-[250px] mb-2'/>
                                                <div className=" flex w-[250px]">
                                                    <TextField id="outlined-basic" size="small" label="Expiration Date" variant="outlined" className='mr-2' />
                                                    <TextField id="outlined-basic" size="small" label="CVV" variant="outlined" />
                                                </div>
                                                <br />
                                                <TextField id="outlined-basic" size="small" label="Name on Card" variant="outlined" className='w-[250px] mt-2' />
                                                <TextField id="outlined-basic" size="small" label="Billing Address" variant="outlined" className='w-[250px] mt-2' />
                                                <TextField id="outlined-basic" size="small" label="Zip Code" variant="outlined" className='w-[250px] mt-2' />

                                            </div>
                                        </>
                                        : null}
                                    <div className="mt-5">
                                        {promoStatus == 0 ? // Waiting for promo code
                                            <CheckPromoForm handlePromoCheck={handlePromoCheck} />
                                            : promoStatus == 1 ? // Promo code is valid
                                                <h1 className='text-xl text-green-600 font-extrabold'>Promo Code Applied!</h1>
                                                :  // Promo code is invalid
                                                <>
                                                    <CheckPromoForm handlePromoCheck={handlePromoCheck} />
                                                    <h1 className='text-xl text-red-400 font-extrabold'>Promo Code Invalid!</h1>
                                                </>
                                        }
                                    </div>
                                </div>
                            </div>
                            : //User not logged in
                            <div className='mt-10 space-y-10'>
                                <h2 className='text-center text-2xl font-extrabold text-primary'>You must be logged in to continue</h2>
                                <div className='flex justify-center'>
                                    <Button className='text-3xl font-extrabold text-primary' onClick={() => router.push('/login')} variant="outlined">Login</Button>
                                </div>
                            </div>
                        }
                    </>
                )
            default: //----------------------------------Error/Done
                return (
                    <div className='flex flex-col justify-center mt-5 text-center text-3xl mt-5'>
                        {bookingStatus == 0 ?
                            //Waiting for booking to submit
                            <h1 className='text-primary font-extrabold'>Loading...</h1>
                            :
                            bookingStatus == 1 ?
                                //Booking submitted successfully
                                <h1 className='text-primary font-extrabold'>Booking Submitted Successfully!</h1>
                                :
                                //Booking failed to submit
                                <h1 className='text-primary font-extrabold'>Booking Failed to Submit!</h1>
                        }
                    </div>
                );
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
                    <Button variant='contained' className='bg-primary' onClick={() => { handleModalOpen(); setModalToShow(0) }}> More Information</Button>
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
                    {bookingStatus == 0 ? //Booking is not done
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
                        : null}
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
                <Box sx={modalStyle} className='text-text-light border-primary border-2 rounded-xl bg-bg-dark w-[400px] lg:w-[800px] p-0 min-h-[300px]'>
                    {modalToShow == 0 ?
                        <MovieModalInfo movie={movie} handleModalClose={handleModalClose} />
                        :
                        <CardModalInfo cards={paymentCards} handleModalClose={handleModalClose} selectCard={selectCard} />
                    }
                </Box>
            </Modal>
        </Layout>

    )
}


function MovieModalInfo({ movie, handleModalClose }: { movie: Movie, handleModalClose?: () => void }) {
    return (
        <>
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
        </>
    );
}

function CardModalInfo({ cards, selectCard, handleModalClose }: { cards: PaymentCard[], handleModalClose: () => void, selectCard: (cardID: number) => void }) {
    return (
        <>
            <div className="flex justify-between items-center m-3">
                <Typography id="modal-modal-title" variant="h6" component="h2" className='font-extrabold'>
                    Payment Cards
                </Typography>
                <IconButton className='' onClick={handleModalClose}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div className="h-full max-h-[80vh] overflow-y-auto m-3 mr-1">
                <div className="flex flex-col min-h-[300px] justify-between">
                    <div className="flex flex-col">
                        {cards.map((card, index) => (
                            <Button key={card.paymentID} className='rounded-xl m-2 p-2' onClick={() => { selectCard(card.paymentID); handleModalClose() }}>
                                <div>
                                    <h2 className='text-xl font-extrabold text-primary'>Card ID: {card.paymentID}</h2>
                                    <div className="flex flex-col justify-between">
                                        <p className='text-lg font-normal text-text-dark normal-case'>CCV: {card.CCV}</p>
                                        <p className='text-lg font-normal text-text-dark normal-case'>Expiration Date: {card.expDate}</p>
                                    </div>
                                </div>
                            </Button>
                        ))}
                        {cards.length == 0 ?
                            <h2 className='text-center text-2xl font-extrabold text-primary'>No Cards Available</h2>
                            :
                            null}
                    </div>
                    <Button variant='contained' className='bg-primary font-extrabold' onClick={() => { selectCard(-1); handleModalClose() }}> Clear Selected Card</Button>
                </div>
            </div>
        </>
    );
}