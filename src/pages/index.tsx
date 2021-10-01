import React, { useEffect } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { MainContainer } from '../components/ui/main-container';
import { APP_NAME } from '../utils/constants';
import { request } from '../utils/request';
import { Box, Heading, SimpleGrid, VStack } from '@chakra-ui/react';
import { ProductCard } from '../components/ui/product-card';
import { currency } from '../utils/formatter';

type Product = {
  _id: string;
  name: string;
  price: number;
  priceFormatted: string;
  image: string;
  countInStock: number;
  slug: string;
  rating: number;
};

type HomeProps = {
  products?: Product[];
  error?: string;
};

const Home: NextPage<HomeProps> = ({ products }) => {
  useEffect(() => {
    console.log(products);
  }, []);

  return (
    <>
      <Head>
        <title>{APP_NAME} - Inicio</title>
      </Head>
      <MainContainer>
        <Heading>Conheça nossos produtos</Heading>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing={10}
          mt="7"
        >
          {products?.map((product) => (
            <VStack justifyContent="center" key={product._id} as="section">
              <ProductCard product={product} />
            </VStack>
          ))}
        </SimpleGrid>
      </MainContainer>
    </>
  );
};

const getStaticProps: GetStaticProps = async () => {
  try {
    const { data } = await request.get('products');

    const formattedData = data.map((product: Product) => ({
      ...product,
      priceFormatted: currency.format(product.price),
    }));

    return {
      props: { products: formattedData },
      revalidate: 60 * 5,
    };
  } catch (ex) {
    const err = ex as Error;
    return {
      props: { error: err.message },
      revalidate: 60 * 5,
    };
  }
};

export { getStaticProps };
export default Home;