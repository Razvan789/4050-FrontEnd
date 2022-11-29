import React, { useState } from 'react'
import styles from './navbar.module.css';
import Avatar from '@mui/material/Avatar';
import { User } from '../utils/user';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MovieIcon from '@mui/icons-material/Movie';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import Badge from '@mui/material/Badge';
import Link from 'next/link';
import { signOut } from '../components/forms';
import { useRouter } from 'next/router';

type NavbarProps = {
  title?: string
  userInfo?: User
}



export default function Navbar({ title = "Default Value", userInfo }: NavbarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(router.query.term as string || "");
  const adminLoggedIn = userInfo?.type === "admin";

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/search?term=${searchTerm}`);
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }
  return (
    <div className="flex flex-row items-center justify-between h-12 md:h-16 bg-bg-dark shadow-md p-4">
      <Link href="/" >
        <div id='Brand' className='flex flex-row items-center text-2xl text-text-light hover:text-text-dark cursor-pointer md:text-3xl font-bold'>
          <MovieIcon className='md:mr-4 text-3xl md:text-5xl' />
          <h1 className='hidden md:block'>{title}</h1>
        </div>
      </Link>
      <div id='right' className='flex flex-row'>
        <form onSubmit={handleSearch}>
          <TextField label="Search" type='text' className='scale-90' size='small' value={searchTerm} onChange={handleSearchChange} />
        </form>

        {!userInfo?.name ? //If user is not logged in
          <Link href="/login">
            <Button color='primary' variant="outlined" className='scale-95' startIcon={<AccountCircleIcon />}>
              Sign in
            </Button>
          </Link>
          : //If user is logged in
          <div className='flex flex-row items-center'>
            {
              adminLoggedIn ? //If user is admin
                <Link href="/adminPage">
                  <Avatar alt={userInfo.name?.toLocaleUpperCase()} src="" className='scale-90 cursor-pointer hover:scale-100 transition-all hover:bg-primary' />
                </Link>
                : //If user is not admin do nothing
                null
            }
            <IconButton >
              <Badge className="scale-[95%]" badgeContent={100} color="primary">
                <LocalActivityIcon className={styles.rotateHover} />
              </Badge>
            </IconButton>
            <Link href="/userSettings">
              <IconButton className={styles.rotateHover}>
                <SettingsIcon />
              </IconButton>
            </Link>
            <Button color='primary' variant="outlined" className='scale-95' onClick={signOut}>
              Sign Out
            </Button>
          </div>
        }
      </div>
    </div>
  )
}

