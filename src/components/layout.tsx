import React from 'react'
import { StyledEngineProvider } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import orange from '@mui/material/colors/orange';

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
// theme = createTheme({
//     palette: {
//         primary: {
//             main: orange[500],
//         },
//         secondary: {
//             main: '#f44336',
//         },
//     },
// });

type layoutProps = {
    children?: React.ReactNode
}

export default function Layout({ children }: layoutProps) {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <div className='bg-slate-800'>
                    {children}
                </div>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
