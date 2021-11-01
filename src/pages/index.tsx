import React, { useEffect } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { SimpleGrid, useToast, VStack, Flex, Box } from '@chakra-ui/react';

import { MainContainer } from '../components/ui/main-container';
import { APP_NAME } from '../utils/constants';
import { request } from '../utils/request';
import { ProductCard } from '../components/ui/product-card';
import { currency } from '../utils/formatter';
import { Title } from '../components/ui/title';
import { useRouter } from 'next/dist/client/router';
import { FeaturedCarousel } from '../components/ui/featured-carousel';

type Product = {
  _id: string;
  name: string;
  price: number;
  priceFormatted: string;
  image: string;
  countInStock: number;
  slug: string;
  rating: number;
  description: string;
  category: string;
  numReviews: number;
};

type HomeProps = {
  products?: Product[];
  featuredProducts?: Product[];
  error?: string;
};

const Home: NextPage<HomeProps> = ({ products, featuredProducts }) => {
  const router = useRouter();
  const toast = useToast();
  const { message } = router.query;

  useEffect(() => {
    if (message) {
      toast({
        title: 'Erro',
        description: String(message),
        status: 'error',
        variant: 'solid',
        isClosable: true,
      });
    }
  }, [message]);

  return (
    <>
      <Head>
        <title>{APP_NAME} - Inicio</title>
      </Head>
      <MainContainer>
        <Flex justifyContent="center" w="100%">
          <Box w="75%">
            <FeaturedCarousel featured={featuredProducts || []} />
          </Box>
        </Flex>
        <Title>Conheça nossos produtos</Title>
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
    const { data } = await request.get<Product[]>('products');

    const formattedData = data
      .map((product: Product) => ({
        ...product,
        priceFormatted: currency.format(product.price),
      }))
      .sort((a, b) => b.rating - a.rating);

    const featuredProducts = [
      formattedData[0],
      formattedData[1],
      formattedData[2],
    ];

    formattedData.splice(0, 3);

    return {
      props: { products: formattedData, featuredProducts },
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
