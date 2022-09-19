import { ImageSearch } from '@mui/icons-material';
import Image from 'next/future/image';
import Rating from '@mui/material/Rating';
import React from 'react'
import { Movie, getMovie } from '../utils/movie';
import Link from 'next/link';
import {myLoader} from '../utils/image';
interface CardProps {
    movie?: Movie,
    link?: string;
    little?: boolean;
}


export default function Card({ movie = getMovie(1), link = "./BookTicket/1", little = false }: CardProps) {
    const cardSizeClasses: string = little ? " hover:scale-105 w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/7" : "hover:scale-110 w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6";
    return (
        <Link href={link}>
            <div className={'relative min-w-[200px] m-2 group cursor-pointer rounded-lg  shadow-md hover:shadow-lg transition-transform ' + cardSizeClasses}>
                <Image src={movie.image}
                    alt={movie.title}
                    loader={myLoader}
                    width={350}
                    height={500}
                    className={little ? 'rounded-lg' : 'rounded-lg group-hover:rounded-b-none'}
                />
                {little ? null
                    :
                    <div id="cardDesc" className='-z-10 absolute w-full bottom-0 rounded-b-lg bg-slate-900 opacity-100 p-3 group-hover:translate-y-full group-hover:opacity-100 transition-all overflow-visible'>
                        <h1 className='text-lg font-extrabold text-slate-500'>{movie.title}</h1>
                        <div className="flex justify-center">
                            <Rating name="read-only" value={movie.rating} precision={0.1} readOnly />
                        </div>
                    </div>
                }
            </div>
        </Link>
    )
}
