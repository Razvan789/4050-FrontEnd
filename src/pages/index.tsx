import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/navbar";
import Layout from "../components/layout";
import { User } from "../utils/user";
import Card from "../components/card";
import CardContainer from "../components/cardContainer";
import {useState} from "react";

interface HomeProps {
  user: User;
}

export default function Home({ user }: HomeProps) {
  // user = {
  //   name: "John Doe",
  //   email: "",
  // };
  return (
    <Layout>
      <Head>
        <title>E-Cinema</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex flex-col min-h-screen p-4">
        <h1 className="w-full text-center text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-600">
          <span className="text-purple-300">E-Cinema</span> App
        </h1>

        {user ? <h2 className="w-full text-center text-2xl md:text-3xl text-gray-600">Welcome <span className='text-purple-300'>{user.name}</span></h2> : <h2 className=" w-full text-center text-2xl md:text-3xl text-gray-600">Welcome Guest</h2>}

        <h2 className="text-purple-100 text-2xl leading-loose font-extrabold">Trending →</h2>
        <CardContainer>
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </CardContainer>
        <h2 className="text-purple-100 text-2xl leading-loose font-extrabold"> All Movies →</h2>
        <CardContainer grid>
          <Card little></Card>
          <Card little></Card>
          <Card little></Card>
          <Card little></Card>
          <Card little></Card>
          <Card little></Card>
          <Card little></Card>
          <Card little></Card>
          <Card little></Card>
          <Card little></Card>
        </CardContainer>
      </main>
    </Layout>
  );
}

