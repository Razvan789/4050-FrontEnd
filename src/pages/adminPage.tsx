import Layout from '../components/layout'
import Head from 'next/head'
import { DataGrid, GridColDef, GridRowId, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState, useEffect } from 'react'
import { Button, Modal, Typography, TextField, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getAllMovies, Movie } from '../utils/movie';
import { getUsers, User } from '../utils/user';
import { getAllPromos, Promo } from '../utils/promo';
import { getAllShows, Show, deleteShow } from '../utils/show';
import { EditMovieForm, AddPromotionForm, EditUserForm, EditTicketTypeForm } from '../components/forms';
import { getAllTicketTypes, TicketType, addTicketType } from '../utils/tickettype';

/* 
    This const will be the database of users, pulling from the MySQL or whatever the DB devs decide to use.
    This will contain the user last name, user first name, and any other user information such as the email, 
    encrypted password, and whatever the DB engineers deem essential/optional for account creation. 

    -SUGGEST age as optional slot
    -SUGGEST Username slot (not just an email) 
    -Will have UIDs with specific and likely self incrementing options
*/

/*
    This is the style of the modal that pops up when the edit button is selected. 
*/

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
let confirmationFunction = () => {
    console.log('Confirmation function called');
}
export default function AdminPage() {
    const [tabValue, setTabValue] = useState(0);
    const [adminLogged, setAdminLogged] = useState(false);
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [promos, setPromos] = useState<Promo[]>([]);
    const [shows, setShows] = useState<Show[]>([]);
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [openMovieID, setOpenMovieID] = useState<GridRowId>(0);
    const [openMovie, setOpenMovie] = useState<Movie | null>(null);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [openPromotion, setOpenPromotion] = useState(false);
    const [openUserModal, setOpenUserModal] = useState(false);
    const [openUser, setOpenUser] = useState<User | null>(null);
    const [openTicketModal, setOpenTicketModal] = useState(false);
    const [openTicket, setOpenTicket] = useState<TicketType | null>(null);
    const handleOpen = (id: GridRowId) => {
        setOpen(true);
        setOpenMovieID(id);
    };
    const handleUserOpen = (id: GridRowId) => {
        setOpenUserModal(true);
        setOpenUser(users.find(user => user?.userID == id) || null);
    };
    const handleTicketOpen = (id: GridRowId) => {
        setOpenTicketModal(true);
        setOpenTicket(ticketTypes.find(ticketTypes => ticketTypes?.typeID == id) || null);
    };
    const openConfirmationModal = (newConfirmationFunction: () => void) => {
        setOpenConfirmation(true);
        confirmationFunction = newConfirmationFunction;
    };
    const handleClose = (functionToUse: (input: boolean) => void, myInput: boolean) => {
        functionToUse(myInput);
        updateAll();
    };
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    useEffect(() => {
        setOpenMovie(movies.find(movie => movie.movieID == openMovieID) || null);
    }, [openMovieID, movies]);
    useEffect(() => {
        if (window.sessionStorage.getItem("admin") == "true") {
            setAdminLogged(true);
            updateAll();
        } else {
            window.location.href = "/";
        }
    }, []);

    function updateAll() {
        getUsers().then((data) => {
            setUsers(data);
        }).catch((err) => {
            console.log(err);
        });

        getAllMovies().then((data) => {
            setMovies(data);
        }).catch((err) => {
            console.log(err);
        });


        getAllPromos().then((data) => {
            setPromos(data);
        }).catch((err) => {
            setPromos([]);
            console.log(err);
        });
        getAllShows().then((data) => {
            setShows(data);
        }).catch((err) => {
            setShows([]);
            console.log(err);
        });
        getAllTicketTypes().then((data) => {
            setTicketTypes(data);
        }).catch((err) => {
            setTicketTypes([]);
            console.log(err);
        })
    }
    //Adds fields to rows that are needed for the DataGrid
    const userRows = users.map((user) => {
        return {
            ...user,
            id: user?.userID,
        }
    });
    const movieRows = movies.map((movie) => {
        return {
            ...movie,
            id: movie?.movieID,
        }
    });
    const promoRows = promos.map((promo) => {
        return {
            ...promo,
            id: promo?.promoID,
        }
    });
    const showRows = shows.map((show) => {
        return {
            ...show,
            id: show?.showID,
            date: show?.movieTime.split(" ")[0],
            time: show?.movieTime.split(" ")[1],
            movie: movies.find((movie) => movie.movieID == show.movieID)?.title,
        }
    });
    const ticketTypeRows = ticketTypes.map((tickettype) => {
        return {
            ...tickettype,
            id: tickettype?.typeID,
            type: tickettype?.type,
            price: tickettype?.price,
        }
    });



    /*
    Definition of the grif and the inclusion of buttons
    This will label the information displayed in the user grid with the const
    This includes the definition of the buttons to be used to edit and delete the specific users
    */

    // Columns for the movie table
    const movieColumns: GridColDef[] = [
        //Buttons for editing and deleting
        {
            field: 'buttons',
            headerName: 'Buttons',
            width: 100,
            renderCell: (params) => (
                <span className=''>
                    <Button
                        color="secondary"
                        variant="outlined"
                        size="small"
                        className='font-extrabold'
                        onClick={() => { handleOpen(params.id) }}
                        style={{ marginLeft: 16 }}
                        tabIndex={params.hasFocus ? 0 : -1}
                    >
                        Info
                    </Button>
                </span>
            ),
        },
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Movie Title', width: 230 },
        { field: 'cast', headerName: 'Cast', width: 230 },
        { field: 'director', headerName: 'Director', width: 130 },
        { field: 'producer', headerName: 'Producer', width: 130 },
        { field: 'synopsis', headerName: 'Synopsis', width: 230 },
        { field: 'reviews', headerName: 'Reviews', width: 130 },
        { field: 'ratingCode', headerName: 'Rating Code', width: 130 },
    ];
    // Columns for the user table
    const userColumns: GridColDef[] = [
        {
            field: 'buttons',
            headerName: 'Buttons',
            width: 100,
            renderCell: (params) => (
                <span className=''>
                    <Button
                        color="secondary"
                        variant="outlined"
                        size="small"
                        className='font-extrabold'
                        onClick={() => { handleUserOpen(params.id) }}
                        style={{ marginLeft: 16 }}
                        tabIndex={params.hasFocus ? 0 : -1}
                    >
                        Edit
                    </Button>
                </span>
            ),
        },
        { field: 'id', headerName: 'ID' },
        { field: 'name', headerName: 'First name', width: 130 },
        { field: 'lastname', headerName: 'Last name', width: 130 },
        { field: 'email', headerName: 'Email', width: 130 },
        { field: 'paymentSaved', headerName: 'Payment Saved', width: 130 },
        { field: 'phone', headerName: 'Phone', width: 130 },
        { field: 'type', headerName: 'Type', width: 130 },
        { field: 'address', headerName: 'Address', width: 130 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'subToPromo', headerName: 'Promotion Subscribed', width: 130 },


    ];

    const promoColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID' },
        { field: 'promoCode', headerName: 'Code', width: 130 },
        { field: 'startTime', headerName: 'Start Time', width: 130 },
        { field: 'endTime', headerName: 'End Time', width: 130 },
        { field: 'percentage', headerName: 'Percentage', width: 130 },
    ];
    const showColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID' },
        { field: 'movieID', headerName: 'Movie ID' },
        { field: 'movie', headerName: 'Movie', width: 130 },
        { field: 'showroomID', headerName: 'Showroom', width: 130 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'time', headerName: 'Time', width: 130 },


        {
            field: 'buttons',
            headerName: 'Buttons',
            width: 120,
            renderCell: (params) => (
                <span className=''>

                    <Button
                        color='error'
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            openConfirmationModal(() => {
                                deleteShow(params.id as number).then(() => {
                                    handleClose(setOpenConfirmation, false);
                                }).catch((err) => {
                                    console.log(err);
                                });
                            })
                        }}
                        className='font-extrabold'
                        style={{ marginLeft: 16 }}
                        tabIndex={params.hasFocus ? 0 : -1}
                    >
                        Delete
                    </Button>
                </span>
            ),
        },


    ];

    const ticketColumns: GridColDef[] = [
        {
            field: 'buttons',
            headerName: 'Buttons',
            width: 120,
            renderCell: (params) => (
                <span className=''>
                    <Button
                        color="secondary"
                        variant="outlined"
                        size="small"
                        className='font-extrabold'
                        onClick={() => { handleTicketOpen(params.id) }}
                        style={{ marginLeft: 16 }}
                        tabIndex={params.hasFocus ? 0 : -1}
                    >
                        Edit
                    </Button>

                </span>
            ),
        },

        { field: 'typeID', headerName: 'Type ID' },
        { field: 'type', headerName: 'Ticket Type' },
        { field: 'price', headerName: 'Ticket Price', width: 130 },

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
            {adminLogged ? ( //If an admin is logged in
                <main className="container mx-auto flex flex-col min-h-screen p-4 max-w-5xl">
                    <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-600">
                        <span className="text-primary">Admin</span> Page
                    </h1>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                            <Tab label="Movies" {...a11yProps(0)} />
                            <Tab label="Users" {...a11yProps(1)} />
                            <Tab label="Promotions" {...a11yProps(2)} />
                            <Tab label="Shows" {...a11yProps(3)} />
                            <Tab label="Tickets" {...a11yProps(4)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={tabValue} index={0}>
                        <Button variant='outlined' className='w-full my-3 text-2xl font-extrabold' onClick={() => { handleOpen(0) }}>Add Movie</Button>
                        <Box sx={{ height: 600, width: 1 }}>
                            <DataGrid
                                rows={movieRows}
                                columns={movieColumns}
                                components={{ Toolbar: customToolbar }}
                            />
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>

                        <Box sx={{ height: 600, width: 1 }}>
                            <DataGrid
                                rows={userRows}
                                columns={userColumns}
                                components={{ Toolbar: customToolbar }}
                            />
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <Button variant='outlined' className='w-full my-3 text-2xl font-extrabold' onClick={() => setOpenPromotion(true)}>Add Promotion</Button>
                        <Box sx={{ height: 600, width: 1 }}>
                            <DataGrid
                                rows={promoRows}
                                columns={promoColumns}
                                components={{ Toolbar: customToolbar }}
                            />
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <Button variant='outlined' className='w-full my-3 text-2xl font-extrabold'>Add Show</Button>
                        <Box sx={{ height: 600, width: 1 }}>
                            <DataGrid
                                rows={showRows}
                                columns={showColumns}
                                components={{ Toolbar: customToolbar }}
                            />
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={4}>
                        <Box sx={{ height: 600, width: 1 }}>
                            {
                            //to be continued, need to get the text fields to display properly, instead of going with the modal datagrid
                            //The datagrid displays properly but the modal doesn't pop up, so need to get the textfield working instead
                            }

                            {/*<form className='flex flex-col space-y-6 p-4 mb-4'>
                                <TextField name="typeID" variant='standard' type="text" label='Ticket Type ID' value={ticketTypeRows.id} onChange={handleFormChange}></TextField>
                                <TextField name="type" variant='standard' type="text" label='Ticket Type' value={ticketTypeRows.type} onChange={handleFormChange}></TextField>
                                <TextField name="price" variant='standard' type="text" label='Price' value={ticketTypeRows.price} onChange={handleFormChange}></TextField>
                                <Button className="bg-primary w-full font-extrabold my-3" variant='contained'>Edit</Button>
                            </form>     */}                      
                            <DataGrid
                                rows={ticketTypeRows}
                                columns={ticketColumns}
                                components={{ Toolbar: customToolbar }}
                            /> 

                        </Box>
                    </TabPanel>


                </main>
            ) : //If an admin is not logged in
                <div className="flex justify-center mt-10">
                    <CircularProgress disableShrink className='w-full' />
                </div>}
            <Modal
                open={open}
                onClose={() => { handleClose(setOpen, false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} className='text-text-light border-primary border-2 rounded-xl bg-bg-dark w-[350px] md:w-[500px] lg:w-[800px] p-0'>
                    <EditMovieForm movie={openMovie || {} as Movie} />
                </Box>
            </Modal>

            <Modal
                open={openPromotion}
                onClose={() => { handleClose(setOpenPromotion, false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} className='text-text-light border-primary border-2 rounded-xl bg-bg-dark w-[350px] md:w-[500px] lg:w-[800px] p-0'>
                    <AddPromotionForm />
                </Box>
            </Modal>

            <Modal
                open={openUserModal}
                onClose={() => { handleClose(setOpenUserModal, false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} className='text-text-light border-primary border-2 rounded-xl bg-bg-dark w-[350px] md:w-[500px] lg:w-[800px] p-0'>
                    <EditUserForm user={openUser || {} as User}></EditUserForm>
                </Box>
            </Modal>

            <Modal
                open={openConfirmation}
                onClose={() => { handleClose(setOpenConfirmation, false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} className='text-text-light border-primary border-2 rounded-xl bg-bg-dark w-[300px] p-0'>
                    <div className="text-3xl flex flex-col justify-center items-center pt-3">
                        <h1>Are you sure?</h1>
                        <div className="flex justify-between w-full p-10 pb-2">
                            <Button onClick={() => { handleClose(setOpenConfirmation, false) }}>No</Button>
                            <Button onClick={() => { confirmationFunction() }} variant='contained' className='bg-primary'>Yes</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open = {openTicketModal}
                onClose={() => { handleClose(setOpenTicketModal, false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} className='text-text-light border-primary border-2 rounded-xl bg-bg-dark w-[350px] md:w-[500px] lg:w-[800px] p-0'>
                    <EditTicketTypeForm inTicketType={openTicket || {} as TicketType}></EditTicketTypeForm>
                </Box>
            </Modal>
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
