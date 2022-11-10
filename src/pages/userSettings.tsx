import React from 'react';
import Layout from '../components/layout';
import Head from 'next/head';
import { Box } from '@mui/system';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material'
import { useUser } from '../utils/user';
import { UpdateProfileForm } from '../components/forms';
import { serverUrl } from '../utils/backendInfo';
import PaymentCardInfo from '../components/paymentCardInfo';
import { AddPaymentForm } from '../components/forms';


const rows = [
    { id: 1, cardNumber: 1111 },
    { id: 2, cardNumber: 2222 },
    { id: 3, cardNumber: 3333 }

];

const customToolbar = () => {
    return (
        <GridToolbarContainer className='p-2 pb-0'>
            <GridToolbarQuickFilter debounceMs={500} className='w-full' />
        </GridToolbarContainer>
    );
};


type cardInfo = {
    paymentID: number,
    paymentNum: string,
    expDate: string,
    cvc: string,
}

export default function UserSettings() {
    const [tabValue, setTabValue] = useState(0);
    //eslint-disable-next-line
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);
    const [paymentCards, setPaymentCards] = useState<cardInfo[]>([]);
    const [cardDetailsOpen, setCardDetailsOpen] = useState(false);
    const user = useUser();
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        if (user?.name != null) {
            getPaymentCards(user.userID);
        } 
    }, [user]);

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
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'cardNumber', headerName: 'Card Number', width: 130 },

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
                        onClick={handleOpen}
                        style={{ marginLeft: 16 }}
                        tabIndex={params.hasFocus ? 0 : -1}
                    >
                        Edit
                    </Button>
                    <Button
                        color='error'
                        variant="outlined"
                        size="small"
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
                        <Tab label="Site Settings" {...a11yProps(3)} />
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
                            <PaymentCardInfo key={card.paymentID} cardNum={card.paymentNum} cardExp={card.expDate} cardID={card.paymentID} />
                        ))}
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Box sx={{ height: 600, width: 1 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            components={{ Toolbar: customToolbar }}
                        />
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                    <Box sx={{ height: 600, width: 1 }}>
                        <form className='flex flex-col space-y-6 p-4 mb-4 w-full'>
                            <h1 className="w-full text-xl md:text-[1rem] leading-normal font-extrabold text-gray-600">
                                <span className="text-primary">Fonts: </span>
                            </h1>
                            <select>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Comic Sans">Comic Sans</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Helvetica">Helvetica</option>
                            </select>
                            <h1 className="w-full text-xl md:text-[1rem] leading-normal font-extrabold text-gray-600">
                                <span className="text-primary">Colorblind Mode: </span>
                            </h1>
                            <select>
                                <option value="Not Colorblind">Not Colorblind</option>
                                <option value="Red-Green Colorblind">Red-Green Colorblind</option>
                            </select>
                            <Button className="bg-primary w-full font-extrabold my-3" variant='contained'>Update Site Settings</Button>
                        </form>
                    </Box>
                </TabPanel>


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
