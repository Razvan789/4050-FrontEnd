import Image from 'next/future/image';
import {Rating, Button} from '@mui/material';
import React from 'react'
import { Movie, getMovie } from '../utils/movie';
import Link from 'next/link';
import {myLoader} from '../utils/image';
interface CardProps {
    movie?: Movie,
    link?: string;
    little?: boolean;
}


export default function Card({ movie = getMovie(1), link = "/BookTicket/1", little = false }: CardProps) {
    const cardSizeClasses: string = little ? " hover:scale-105 w-1/6 md:w-1/5 lg:w-1/6 xl:w-1/7" : "hover:scale-110 w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6";
    return (
        <Link href={link}>
            <div className={'relative min-w-[200px] m-2 group cursor-pointer rounded-lg  shadow-md hover:shadow-lg transition-transform ' + cardSizeClasses}>
                <Image src={movie.trailerPic}
                    alt={movie.title}
                    loader={myLoader}
                    width={350}
                    height={500}
                    className={little ? 'rounded-lg' : 'rounded-lg group-hover:rounded-b-none'}
                />
                {little ? null
                    :
                    <div id="cardDesc" className='z-10 md:-z-10 absolute w-full bottom-0 rounded-b-lg bg-bg-dark opacity-100 p-3 md:group-hover:translate-y-full transition-all overflow-visible'>
                        <h1 className='text-lg font-extrabold text-text-dark'>{movie.title}</h1>
                        <div className="flex flex-col items-center justify-center">
                            <Rating name="read-only" value={movie.ratingCode} precision={0.1} readOnly />
                        </div>
                    </div>
                }
            </div>
        </Link>
    )
}
