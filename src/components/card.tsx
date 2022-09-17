import { ImageSearch } from '@mui/icons-material';
import Image from 'next/future/image';
import Rating from '@mui/material/Rating';
import React from 'react'

interface CardProps {
    title?: string;
    rating?: number;
    image?: string;
    link?: string;
    little?: boolean;
}
//Loader is only used to pull from
interface loaderInterface {
    src: string;
}
const myLoader = ({ src }: loaderInterface) => {
    return `${src}`
}

export default function Card({ title = "Spider-Man: No Way Home", rating = 3.5, image = "https://images.fandango.com/ImageRenderer/0/0/redesign/static/img/default_poster.png/0/images/masterrepository/Fandango/225415/SMRR_935x1381_Digital_1Sheet.jpg", link = ".", little = false }: CardProps) {
    const cardSizeClasses: string = little ? "min-w-[200px] w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/7" : "min-w-[200px] w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6";
    return (
        <div className={'relative m-2 group cursor-pointer rounded-lg hover:scale-110 shadow-md hover:shadow-lg transition-transform ' + cardSizeClasses}>
            <Image src={image}
                alt={title}
                loader={myLoader}
                width={350}
                height={500}
                className=' rounded-lg group-hover:rounded-b-none'
            />
            {little ? null
                :
                <div id="cardDesc" className='-z-10 absolute w-full bottom-0 rounded-b-lg bg-slate-900 opacity-100 p-3 group-hover:translate-y-full group-hover:opacity-100 transition-all overflow-visible'>
                    <h1 className='text-lg font-extrabold text-slate-500'>{title}</h1>
                    <div className="flex justify-center">
                        <Rating name="read-only" value={rating} precision={0.1} readOnly />
                    </div>
                </div>
            }
        </div>
    )
}
