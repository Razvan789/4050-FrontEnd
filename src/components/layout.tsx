import React from 'react'
import { StyledEngineProvider } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from './navbar';
import { User } from '../utils/user';
import orange from '@mui/material/colors/orange';

//Required for theming in typescript
declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: React.CSSProperties['color'];
        };
    }

    interface Palette {
        neutral: Palette['primary'];
    }
    interface PaletteOptions {
        neutral: PaletteOptions['primary'];
    }

    interface PaletteColor {
        darker?: string;
    }
    interface SimplePaletteColorOptions {
        darker?: string;
    }
    interface ThemeOptions {
        status: {
            danger: React.CSSProperties['color'];
        };
    }
}
//Change MUI component theme here
const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#D8B4FE',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
    },
});

type layoutProps = {
    children?: React.ReactNode,
}

export default function Layout({ children }: layoutProps) {
    //let user;
    const user: User = {
       name: "John Doe",
       email: "",
    };


    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='bg-slate-800 overflow-hidden'>
                        <main className="container flex flex-col min-h-screen mx-auto min-w-full" >
                        <Navbar title="E-Cinema" userInfo={user} />
                            {children}
                        </main>
                    </div>
                </LocalizationProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
