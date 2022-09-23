import Link from 'next/link'
import React from 'react'
import Layout from '../components/layout'

export default function Custom404() {
  return (
    <Layout>
        <main className="container m-auto flex flex-col p-4">
            <h1 className="w-full text-center text-6xl md:text-[5rem] leading-normal font-extrabold text-gray-600">
                <span className="text-purple-300">404</span> Page Not Found
            </h1>
            <h2 className="w-full text-center text-2xl md:text-3xl text-gray-600">The page you are looking for does not exist. Please return <Link href="/"><span className='text-purple-300 font-extrabold cursor-pointer underline'>Home</span></Link></h2>
        </main>
    </Layout>
  )
}
