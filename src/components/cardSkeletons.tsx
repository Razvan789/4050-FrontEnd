import React from 'react'
import { Skeleton } from '@mui/material'

export default function CardSkeletons({ cardCount }: { cardCount: number }) {

    const skeletons = [];
    for (let i = 0; i < cardCount; i++) {
        i === 0 ? skeletons.push(<Skeleton variant="rectangular" className="rounded-xl ml-5 mt-5" width={210} height={300} />) : skeletons.push(<Skeleton variant="rectangular" className="rounded-xl" width={210} height={300} />)
    }
    return (
    <div className='flex justify-center items-center flex-wrap mt-10 space-x-5 space-y-5'>
        {skeletons}
    </div>
    )
}
