import { Container } from 'postcss';
import React from 'react'
import styles from './navbar.module.css';
import Avatar from '@mui/material/Avatar';
import { User } from '../utils/user';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MovieIcon from '@mui/icons-material/Movie';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';

type NavbarProps = {
  title?: string
  userInfo?: User
}

export default function Navbar({ title = "Default Value", userInfo }: NavbarProps) {
  const theme = useTheme();
  return (
    <div className="flex flex-row items-center justify-between h-12 md:h-16 bg-slate-900 shadow-md p-4">
      <Link href="/" >
        <div id='Brand' className='flex flex-row items-center text-2xl text-slate-300 hover:text-slate-100 cursor-pointer md:text-3xl font-bold text-white'>
          <MovieIcon className='md:mr-4 text-3xl md:text-5xl' />
          <h1 className='hidden md:block'>{title}</h1>
        </div>
      </Link>
      <div id='right' className='flex flex-row'>
        <TextField label="Search" className='scale-90' size='small' />



        {!userInfo ?
          <Link href="/login">
            <Button color='primary' variant="outlined" className='scale-95' startIcon={<AccountCircleIcon />}>
              Sign in
            </Button>
          </Link>
          :
          <div className='flex flex-row items-center'>
            <Link href="/adminPage">
              <Avatar alt={userInfo.name} src="/static/images/avatar/1.jpg" className='scale-90 cursor-pointer hover:scale-100 transition-all hover:bg-purple-300' />
            </Link>
            <Link href="/userSettings">
              <IconButton href='' className={styles.rotateHover}>
                <SettingsIcon />
              </IconButton>
            </Link>
          </div>
        }
      </div>
    </div>
  )
}

