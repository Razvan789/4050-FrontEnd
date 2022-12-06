import React from 'react';
import Layout from '../components/layout';
import Head from 'next/head';
import { Box } from '@mui/system';
import { DataGrid, GridColDef, GridRowId, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState, useEffect } from 'react';
import { Button, Modal } from '@mui/material'
import { useUser } from '../utils/user';
import { UpdateProfileForm } from '../components/forms';
import { serverUrl } from '../utils/backendInfo';
import PaymentCardInfo from '../components/paymentCardInfo';
import { AddPaymentForm } from '../components/forms';
import { PaymentCard, getPaymentCardByUserID, addPaymentCard } from '../utils/paymentcard';
import { Booking, getBookingsByUserID, } from '../utils/booking';
import { Show, getShow } from '../utils/show';
import { Movie, getMovie, getAllMovies } from '../utils/movie';
import { TicketsDisplay } from '../components/ticketsDisplay';


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    p: 4,
};

const customToolbar = () => {
    return (
        <GridToolbarContainer className='p-2 pb-0'>
            <GridToolbarQuickFilter debounceMs={500} className='w-full' />
        </GridToolbarContainer>
    );
};


export default function UserSettings() {
    const [tabValue, setTabValue] = useState(0);
    //eslint-disable-next-line
    const [openTickets, setOpenTickets] = useState(false);
    const handleOpen = (bookingID: GridRowId) => { setOpenTickets(true); setSelectedBookingID(bookingID); };
    const handleClose = () => setOpenTickets(false);
    const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBookingID, setSelectedBookingID] = useState<GridRowId>(0);
    const [shows, setShows] = useState<Show[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [cardDetailsOpen, setCardDetailsOpen] = useState(false);
    const user = useUser();
    const [updateShows, setUpdateShows] = useState(false);



    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };


    useEffect(() => {
        if (user?.name != null) {
            getPaymentCards(user.userID);
            getBookingsByUserID(user.userID).then((data) => {
                setBookings(data);
                setUpdateShows(!updateShows);
            });
            getAllMovies().then((data) => {
                setMovies(data);
            });
        }
    }, [user]);

    //Update shows when bookings are updated
    useEffect(() => {
        bookings.forEach((booking) => {
            getShow("showID", booking.showID).then((show) => {
                setShows((shows) => [...shows, show]);
            });
        });
    }, [updateShows]);


    //Update movies when shows are updated
    // useEffect(() => {

    // }, [updateMovies]);




    function getPaymentCards(userID: number) {
        fetch(`${serverUrl}/payment-card?userID=${userID}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPaymentCards(data);
            })
    }

    function handleOpenCard() {
        if (cardDetailsOpen) {
            setCardDetailsOpen(false);
        } else {
            setCardDetailsOpen(true)
        }
    }

    /*
    Definition of the grif and the inclusion of buttons
    This will label the information displayed in the user grid with the const
    This includes the definition of the buttons to be used to edit and delete the specific users
*/
    const bookingRows = bookings.map((booking) => {
        const show = shows.find((show) => show.showID === booking.showID);
        const movie = movies.find((movie) => movie.movieID === show?.movieID);
        return {
            ...booking,
            id: booking.bookingID,
            movie: movie?.title,
            showTime: show?.movieTime,
        };
    });

    const bookingColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'total', headerName: 'Total Price', width: 130 },
        { field: 'movie', headerName: 'Movie', width: 130 },
        { field: 'showTime', headerName: 'Show Time', width: 200 },

        {
            field: 'buttons',
            headerName: 'Buttons',
            width: 200,
            renderCell: (params) => (
                <span className=''>
                    <Button
                        color="secondary"
                        variant="outlined"
                        size="small"
                        className='font-extrabold'
                        onClick={() => handleOpen(params.id)}
                        style={{ marginLeft: 16 }}
                        tabIndex={params.hasFocus ? 0 : -1}
                    >
                        See Tickets
                    </Button>
                </span>
            ),
        },
    ];

    /*
        The actual page definition and display, includes the icon and other factors
        will optimize for accessibility purposes, including dyslexia and visual impairment of other kinds 

        -SUGGEST DYSLEXIA FONT
        -SUGGEST FONT SIZE DYNAMICS
    */
    return (
        <Layout>
            <Head>
                <title>E-Cinema</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto flex flex-col min-h-screen p-4 max-w-5xl">
                <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-600">
                    <span className="text-primary">User</span> Settings
                </h1>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label="Account Settings" {...a11yProps(0)} />
                        <Tab label="Payment Methods" {...a11yProps(1)} />
                        <Tab label="Order History" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ height: 600, width: 1 }}>
                        <UpdateProfileForm user={user} />
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ height: 600, width: 1 }}>
                        {paymentCards.length < 3 ?
                            <Button variant='outlined' className='w-full my-3 text-2xl font-extrabold' onClick={handleOpenCard}>Add Payment Method</Button>
                            : null}
                        <div className={cardDetailsOpen ? "block w-full" : "hidden"}>
                            <AddPaymentForm user={user} />
                        </div>
                        {paymentCards.map((card) => (
                            <PaymentCardInfo key={card.paymentID} card={card}/>
                        ))}
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Box sx={{ height: 600, width: 1 }}>
                        <DataGrid
                            rows={bookingRows}
                            columns={bookingColumns}
                            components={{ Toolbar: customToolbar }}
                        />
                    </Box>
                </TabPanel>
                <Modal
                    open={openTickets}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle} className='text-text-light border-primary border-2 rounded-xl bg-bg-dark w-[350px] md:w-[500px] lg:w-[800px] p-0'>
                        <div className='flex flex-col items-center justify-center'>
                            <h1 className='text-3xl font-extrabold text-center'>Tickets</h1>
                            <TicketsDisplay bookingID={selectedBookingID} />
                        </div>

                    </Box>
                </Modal>
            </main>
        </Layout>

    )
}


//Tab Helper Functions

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box className='pt-3'>
                    {children}
                </Box>
            )}
        </div>
    );
}
