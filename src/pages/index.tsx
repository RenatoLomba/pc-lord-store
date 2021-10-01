import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { MainContainer } from '../components/ui/main-container';
import { APP_NAME } from '../utils/constants';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME} - Veja nossos produtos</title>
      </Head>
      <MainContainer>Hello world</MainContainer>
    </>
  );
};

export default Home;
