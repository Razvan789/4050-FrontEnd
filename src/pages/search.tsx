import React, { useState, useEffect } from 'react'
import Layout from '../components/layout'
import { useRouter } from 'next/router'
import Card from '../components/card'
import CardSkeletons from '../components/cardSkeletons'

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

            {loading ?
                // If loading is true, show skeletons
                <CardSkeletons cardCount={5} />
                : //If loading is false, show cards 
                (
                    <div className='flex justify-center items-center flex-wrap mt-10 space-x-5 space-y-5'>
                        <Card />
                    </div>
                )
            }
        </Layout>

    )
}
