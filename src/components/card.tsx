import Image from 'next/future/image';
import React from 'react'
import { Movie, getMovie } from '../utils/movie';
import Link from 'next/link';
import { myLoader } from '../utils/image';
import { CustomTooltip } from './CustomTooltip';
import Zoom from '@mui/material/Zoom';
interface CardProps {
    movie?: Movie,
    link?: string;
    little?: boolean;
}

const defaultMovie: Movie = {
    movieID: 0,
    title: "",
    cast: "",
    director: "",
    producer: "",
    synopsis: "",
    reviews: "",
    ratingCode: "",
    trailerPic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu5iprMc1MEpOTSC7jAnweLJdcMeUL3jJg4AiNoTs&s",
    video: ""
}

export default function Card({ movie, link = "/BookTicket/1", little = false }: CardProps) {
    const cardSizeClasses: string = little ? " hover:scale-105 w-1/6 md:w-1/5 lg:w-1/6 xl:w-1/7" : "hover:scale-110 w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6";
    console.log("Movie: ", movie);
    return (
        <Link href={"/BookTicket/" + movie?.movieID} >
            {little ?
                //Little Card 

                <CustomTooltip title={movie?.title || "Error"} TransitionComponent={Zoom} followCursor>
                    <div className={'relative min-w-[200px] m-2 group cursor-pointer rounded-lg  shadow-md hover:shadow-lg transition-transform ' + cardSizeClasses}>

                        <Image src={movie?.trailerPic || defaultMovie.trailerPic}
                            alt={movie?.title}
                            loader={myLoader}
                            width={350}
                            height={500}
                            className={little ? 'rounded-lg' : 'rounded-lg group-hover:rounded-b-none'}
                        />
                    </div>
                </CustomTooltip>
                :
                //Big Card
                <div className={'relative min-w-[200px] m-2 group cursor-pointer rounded-lg  shadow-md hover:shadow-lg transition-transform ' + cardSizeClasses}>
                    <Image src={movie?.trailerPic || defaultMovie.trailerPic}
                        alt={movie?.title}
                        loader={myLoader}
                        width={350}
                        height={500}
                        className={little ? 'rounded-lg' : 'rounded-lg group-hover:rounded-b-none'}
                    />
                    <div id="cardDesc" className='z-10 md:-z-10 absolute w-full bottom-0 rounded-b-lg bg-bg-dark opacity-100 p-3 md:group-hover:translate-y-full transition-all overflow-visible'>
                        <h1 className='text-lg font-extrabold text-text-dark'>{movie?.title}</h1>
                        <div className="flex flex-col items-center justify-center">
                        </div>
                    </div>
                </div>
            }
        </Link >
    )
}
