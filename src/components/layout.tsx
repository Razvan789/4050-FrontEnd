import React from 'react'
import { hexToRgb, StyledEngineProvider } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from './navbar';
import { useRouter } from 'next/router';
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
const primary = "#D8B4FE"; //D8B4FE
const primaryParse = parseColorString(hexToRgb(primary));

if(typeof window !== 'undefined'){
    document.documentElement.style.setProperty('--color-primary', primaryParse);
}

const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        mode: 'dark',
        primary: {
            main: primary,
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
export const UserContext = React.createContext({} as User);
export default function Layout({ children }: layoutProps) {
    const router = useRouter();
    let user: User = null;
    if (router.query.user) {
        console.log(router.query.user);
        user = {
            name: String(router.query.user),
            email: "",
        };
        console.log(user);
    }
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <UserContext.Provider value={user}>
                        <div className='bg-slate-800 overflow-hidden'>
                            <main className="container flex flex-col min-h-screen mx-auto min-w-full" >
                                <Navbar title="E-Cinema" userInfo={user} />
                                {children}
                            </main>
                        </div>
                    </UserContext.Provider>
                </LocalizationProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}


function parseColorString(color: string): string {
    const newColor = color.replace(/rgb\(|\)/g, '').replace(/ /g, '');
    return newColor.replace(/,/g, ' ');
}
