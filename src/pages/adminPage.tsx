import Layout from '../components/layout'
import Head from 'next/head'
import { DataGrid, GridToolbar, GridColDef, GridRenderCellParams, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react'
import { Button, Modal, Typography, TextField } from '@mui/material';

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
                    <span className="text-purple-300">Admin</span> Page
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
                <Box sx={modalStyle} className='text-white border-purple-300 border-2 rounded-xl bg-slate-900 w-[350px] p-0'>
                    <div className="h-full max-h-[80vh] overflow-y-auto m-3 mr-0">

                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Text in a modal
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                        <div className="flex flex-wrap justify-center">
                            <TextField label="This is a text field"></TextField>
                            <TextField label="This is a text field"></TextField>
                            <TextField label="This is a text field"></TextField>
                            <TextField label="This is a text field"></TextField>
                            <TextField label="This is a text field"></TextField>
                        </div>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas illum at dicta. Laborum saepe vel impedit, esse iure dolore incidunt totam voluptatum ex perferendis minus laboriosam voluptates similique expedita at quod! Rerum tempore ab pariatur itaque necessitatibus soluta ipsam quaerat! Expedita excepturi perspiciatis nisi corrupti? Odio tempora, inventore, saepe, nihil aspernatur nesciunt molestias assumenda voluptates a nam illum sit laborum voluptatem nulla provident quod officiis minima nobis quos eius unde. Cupiditate deserunt soluta ea rerum dignissimos ut. Temporibus voluptatem minus, totam nam sunt eos possimus blanditiis sequi, rerum explicabo debitis distinctio consequatur. Asperiores itaque eos cumque natus laudantium perspiciatis doloribus aperiam voluptatibus cupiditate, officia dolore eligendi ea, repellendus facere nihil et laboriosam, deleniti quia ducimus vero odit accusamus. Architecto eaque sed repellendus consectetur suscipit impedit molestias autem facilis! Porro repellendus ad soluta cupiditate eos officia ipsum architecto, corporis dolorum reprehenderit? Libero nam officia sed incidunt, natus eaque ea sit autem nisi quibusdam delectus sapiente maiores at, veritatis similique odit, quo officiis eveniet fugit! Excepturi fugit a pariatur quo provident aperiam vero eos dicta, necessitatibus ut recusandae! Libero totam beatae fuga doloribus odit blanditiis cupiditate mollitia optio odio inventore nisi incidunt neque rem fugiat corporis, iusto est. Unde, iure voluptates. Ad qui nemo enim eveniet ipsum debitis, facere aliquid molestias aperiam facilis. Aut ea doloribus et eaque, omnis error vel distinctio reiciendis molestias ab nobis delectus officia, unde facere expedita recusandae debitis eos fuga iure dignissimos ducimus odit earum adipisci. Laborum, voluptas. Nam perspiciatis molestiae fugit, dignissimos voluptate minima nostrum aspernatur ipsa? Ex animi incidunt quis mollitia voluptatum delectus, consectetur tempora fugiat deleniti laudantium sapiente aspernatur praesentium accusamus. Voluptates architecto reiciendis porro minus nam eveniet officiis nostrum iste ea veritatis, quas aut. Quidem porro animi adipisci fugiat suscipit sit ipsam accusamus labore reiciendis consequuntur. Et odit dolores, numquam deserunt eius cum culpa iste inventore, est atque, officiis vitae natus necessitatibus ratione. Harum beatae magnam eius a consectetur ea ullam, tempora optio quaerat itaque omnis? Asperiores quia pariatur id doloribus odio. Ullam praesentium neque quis, sapiente pariatur quasi corrupti eum nisi cupiditate quibusdam. Illum harum voluptatem rerum illo tenetur ratione id debitis voluptate enim dignissimos, quidem iusto dolores. Doloremque libero natus delectus veniam laboriosam a accusamus praesentium similique at et, sint dolore explicabo consectetur iusto placeat odit nostrum ducimus quasi voluptatem dicta, nisi recusandae sapiente? Nisi id laborum, perspiciatis iusto nesciunt vel doloremque eligendi eos placeat, temporibus ex odio aliquam ratione. Labore quasi autem praesentium repellendus porro assumenda eos corrupti maiores, commodi repellat. Aliquid tempora impedit blanditiis voluptatem adipisci non aut dolorum hic tempore? Cupiditate eaque debitis vero eveniet, tenetur commodi voluptas vel dicta. Saepe repellat distinctio possimus numquam officiis assumenda autem ea soluta totam? Accusantium numquam ab repellat illum exercitationem earum, rerum consectetur, tempore corrupti cumque deserunt itaque qui culpa dolores consequuntur reprehenderit non? Fugiat beatae ea sed voluptatum maiores nobis harum laudantium voluptatem natus sint soluta, quos ipsum minima laborum id incidunt modi. Perspiciatis ipsum id deleniti a, numquam quisquam quae temporibus harum? Cumque, dignissimos? Optio a quae iure explicabo porro esse possimus exercitationem ut nisi vel quis, suscipit enim magnam natus vitae quidem ea! Assumenda libero commodi nesciunt perspiciatis modi, magni, fugit debitis repellat saepe odio voluptatem obcaecati minus iure animi accusamus, voluptas est neque ad sequi ab ipsum numquam quam quis eveniet. Nemo nulla quaerat optio exercitationem ducimus sint quibusdam porro tenetur nihil debitis! Modi eaque beatae, iste cumque veritatis itaque! Sint odio maxime ipsum hic sunt? Corrupti rem aperiam quisquam molestiae, quidem ad possimus, doloremque quasi omnis rerum eius, exercitationem accusantium sit. In eligendi quasi dolores consequatur rerum quo ex possimus, mollitia error explicabo atque ipsum, consequuntur iusto aspernatur voluptatum? Similique dicta doloribus nulla? Nesciunt in iusto expedita sed praesentium veniam vitae eaque ullam maiores autem aperiam quisquam reiciendis quae, error debitis suscipit iste nulla vel placeat repellendus culpa architecto eligendi dolorum repellat. Nihil necessitatibus rem ex dicta placeat laborum ducimus accusamus itaque obcaecati harum, nisi, pariatur deleniti illum. Id voluptatem, inventore maiores, delectus est dolor aliquid asperiores animi beatae ducimus cum nulla? Praesentium nobis assumenda ducimus maiores sunt totam esse nemo, sit unde natus blanditiis suscipit voluptas ea adipisci dolorem! Alias vero, minus natus eum enim expedita. Deserunt, alias non fugiat ullam harum corrupti fugit quibusdam itaque quod facilis dicta quos perspiciatis ut cupiditate veniam deleniti placeat! Commodi sapiente expedita harum excepturi veritatis quo animi accusamus dolores similique blanditiis cumque, quidem amet consectetur voluptatum perspiciatis accusantium illum iusto totam inventore saepe doloremque et. Quas doloribus earum hic suscipit quae numquam, perferendis ipsum vel maxime excepturi, quibusdam sequi rerum sed tempore libero officiis quos ratione provident aspernatur fugit ut veritatis amet. Ex tempora perferendis nulla expedita aut, totam corrupti officia voluptas impedit, porro fugit ipsa dicta provident modi tempore illum eaque quidem, error quo suscipit nisi. Quo nisi ullam et reprehenderit. Et quos eum placeat, nulla iste eligendi nisi rerum soluta impedit dolorum commodi minus est doloremque, numquam ratione culpa asperiores ullam nemo officia veniam delectus. Natus dolore dolorem tenetur commodi sed aperiam itaque corporis pariatur reprehenderit magni possimus corrupti, exercitationem fuga distinctio praesentium, voluptatem perspiciatis aliquid. Praesentium id, minus quasi quaerat tenetur numquam sequi dolorem cupiditate sed earum, nihil aperiam? Autem, blanditiis ea quas nisi sunt perferendis quae reiciendis mollitia beatae culpa, accusantium quod minus vel quia numquam minima inventore obcaecati vitae accusamus. Assumenda provident rerum, facilis quos illo molestias quibusdam quisquam quae veniam, aliquam atque maiores eum, reiciendis voluptate nemo hic architecto ex repudiandae perferendis voluptatibus id quasi. Cupiditate ipsam deleniti soluta obcaecati nobis culpa sit a iusto. Earum ipsa voluptates corrupti error soluta quos necessitatibus exercitationem? Laudantium molestias laboriosam in, itaque necessitatibus commodi quia, distinctio inventore autem, velit sapiente blanditiis nisi? Mollitia, nemo sint! Culpa est quasi quisquam ipsa repudiandae facere molestiae pariatur itaque excepturi perferendis doloribus labore provident necessitatibus soluta, ullam dolor. Culpa voluptates ut corporis maxime deleniti. Ad velit vitae explicabo deleniti excepturi nostrum voluptas. Obcaecati, commodi doloremque cumque suscipit corporis laborum exercitationem fuga. Sit illum perferendis similique minus animi! Voluptas alias ducimus voluptatem dolor doloribus rerum repellat harum earum reiciendis dolorem!
                        </p>
                    </div>
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
