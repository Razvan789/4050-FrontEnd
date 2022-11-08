import React, { useState, useEffect} from 'react'
import Layout from '../components/layout'
import { CircularProgress, Skeleton } from '@mui/material'
import { useRouter } from 'next/router'

export default function Search() {
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const searchTerm = router.query.term;
    
    setTimeout(() => {
        setLoading(false);
    }, 3000)

    useEffect(() => {
        setLoading(true);
    }, [searchTerm])
    
    return (
        <Layout>
            <h1 className='font-extrabold text-4xl text-center pt-4 text-text-dark'><span className='text-primary'>Search</span> Results: </h1>

            {loading ? (
                <div className='flex justify-center items-center flex-wrap mt-10 space-x-5 space-y-5'>
                    <Skeleton variant="rectangular" className="rounded-xl ml-5 mt-5" width={210} height={300} />
                    <Skeleton variant="rectangular" className="rounded-xl" width={210} height={300} />
                    <Skeleton variant="rectangular" className="rounded-xl" width={210} height={300} />
                    <Skeleton variant="rectangular" className="rounded-xl" width={210} height={300} />
                    <Skeleton variant="rectangular" className="rounded-xl" width={210} height={300} />
                    <Skeleton variant="rectangular" className="rounded-xl" width={210} height={300} />
                    <Skeleton variant="rectangular" className="rounded-xl" width={210} height={300} />
                    <Skeleton variant="rectangular" className="rounded-xl" width={210} height={300} />
                </div>) : (
                <div className='flex justify-center items-center flex-wrap mt-10 space-x-5 space-y-5'>
                    <div className="w-60 h-96 rounded-xl ml-5 mt-5 bg-primary"></div>
                    <div className="w-60 h-96 rounded-xl bg-primary"></div>
                </div>
            )
            }
        </Layout>

    )
}
