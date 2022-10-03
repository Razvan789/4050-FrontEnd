import Layout from '../components/layout'
import Head from 'next/head'
import { DataGrid, GridToolbar, GridColDef, GridRenderCellParams, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react'
import { Button, Modal, Typography, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/* 
    This const will be the database of users, pulling from the MySQL or whatever the DB devs decide to use.
    This will contain the user last name, user first name, and any other user information such as the email, 
    encrypted password, and whatever the DB engineers deem essential/optional for account creation. 

    -SUGGEST age as optional slot
    -SUGGEST Username slot (not just an email) 
    -Will have UIDs with specific and likely self incrementing options
*/
const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },

];

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

export default function AdminPage() {
    const [tabValue, setTabValue] = useState(0);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };


    /*
        Definition of the grif and the inclusion of buttons
        This will label the information displayed in the user grid with the const
        This includes the definition of the buttons to be used to edit and delete the specific users
    */
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        { field: 'age', headerName: 'Age', type: 'number', width: 90 },

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
                    <span className="text-primary">Admin</span> Page
                </h1>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label="Movies" {...a11yProps(0)} />
                        <Tab label="Users" {...a11yProps(1)} />
                        <Tab label="Promotions" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    <Button variant='outlined' className='w-full my-3 text-2xl font-extrabold'>Add Movie</Button>
                    <Box sx={{ height: 600, width: 1 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            components={{ Toolbar: customToolbar }}
                        />
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>

                    <Box sx={{ height: 600, width: 1 }}>
                        <DataGrid
                            rows={rows.slice(0, 6)}
                            columns={columns}
                            components={{ Toolbar: customToolbar }}
                        />
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Button variant='outlined' className='w-full my-3 text-2xl font-extrabold'>Add Promotion</Button>
                    <Box sx={{ height: 600, width: 1 }}>
                        <DataGrid
                            rows={rows.slice(0, 2)}
                            columns={columns}
                            components={{ Toolbar: customToolbar }}
                        />
                    </Box>
                </TabPanel>


            </main>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} className='text-text-light border-primary border-2 rounded-xl bg-bg-bg-dark w-[350px] lg:w-[800px] p-0'>
                    <div className="h-full max-h-[80vh] overflow-y-auto m-3 mr-1">
                        <div className="flex justify-between items-center ">
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Edit Movie/User/Promotion
                            </Typography>
                            <IconButton className='' onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        </Typography>
                        <div className="flex flex-wrap justify-center items-center space-x-2 space-y-2">
                            <TextField variant='standard' className='ml-2 mt-2' label="Title"></TextField>
                            <TextField variant='standard' className='' label="Rating"></TextField>
                            <TextField variant='standard' className='' label="ShowTimes"></TextField>
                            <TextField variant='standard' className='' label="Director"></TextField>
                            <TextField variant='standard' className='' label="Producer"></TextField>
                            <TextField variant='standard' className='' label="Cast"></TextField>
                            <TextField variant='standard' className='' label="Description"></TextField>
                            <TextField variant='standard' className='' label="Categories"></TextField>
                        </div>
                    </div>
                    <Button variant='contained' className='bg-primary float-right m-4' onClick={handleClose}> Save Changes</Button>
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
