import React, { createContext, useEffect, useState } from 'react'
import { hexToRgb, StyledEngineProvider } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from './navbar';
import { User } from '../utils/user';

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
const colorMode = 'dark';
//Change theme here
const themes = [
    {
        'light': {
            primary: "#396b73",
            bg: {
                light: "#D8DBE2",
                dark: "#A9BCD0"
            },
            text: {
                light: "#373F51",
                dark: "#1B1B1E"
            }
        },
        'dark': {
            primary: "#58A4B0",
            bg: {
                light: "#373F51",
                dark: "#1B1B1E"
            },
            text: {
                light: "#D8DBE2",
                dark: "#A9BCD0"
            }
        }
    },
    {
        'light': {
            primary: "#396b73",
            bg: {
                light: "#D8DBE2",
                dark: "#A9BCD0"
            },
            text: {
                light: "#373F51",
                dark: "#1B1B1E"
            }
        },
        'dark': {
            primary: "#D8B4FE",
            bg: {
                light: "#1F293C",
                dark: "#0F172A"
            },
            text: {
                light: "#FFFFFF",
                dark: "#64748B"
            }
        }
    },
]

const colors = themes[1];
const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        mode: colorMode,
        primary: {
            main: colors?.[colorMode].primary || '#58A4B0',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
    },
});

const primaryParse = parseColors(colors?.[colorMode]);
console.log(primaryParse);
if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty('--color-primary', colors?.[colorMode].primary || '#58A4B0');
    document.documentElement.style.setProperty('--color-bg-light', colors?.[colorMode].bg.light || '#373F51');
    document.documentElement.style.setProperty('--color-bg-dark', colors?.[colorMode].bg.dark || '#1B1B1E');
    document.documentElement.style.setProperty('--color-text-light', colors?.[colorMode].text.light || '#D8DBE2');
    document.documentElement.style.setProperty('--color-text-dark', colors?.[colorMode].text.dark || '#A9BCD0');
}

type layoutProps = {
    children?: React.ReactNode,
    user?: User,
}
export let UserContext = createContext({} as User);
export default function Layout({ children, }: layoutProps) {
    useEffect(() => {
        const tempUser = typeof window !== 'undefined' ? JSON.parse(window.sessionStorage.getItem('user') || '{}') : {};
        setUser(tempUser);
    }, [])
    const [user, setUser] = useState<User>({} as User);
    UserContext = createContext(user);
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <UserContext.Provider value={user}>
                        <div className='bg-bg-light overflow-hidden'>
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


//Takes in a color string in the form of rgb(r,g,b) and returns the string r g b
function parseColorString(color: string): string {
    const newColor = color.replace(/rgb\(|\)/g, '').replace(/ /g, '');
    return newColor.replace(/,/g, ' ');
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseColors(colors: any): string {

    for (const key in colors) {
        if (typeof colors[key] === 'object') {
            parseColors(colors[key]);
        } else {
            colors[key] = parseColorString(hexToRgb(colors[key]));
        }
    }
    return colors;
}