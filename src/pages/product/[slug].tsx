import React, { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import {
  Link,
  Grid,
  Image,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Box,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { APP_NAME } from '../../utils/constants';
import { MainContainer } from '../../components/ui/main-container';
import { request } from '../../utils/request';
import { currency } from '../../utils/formatter';
import { PropertyText } from '../../components/ui/property-text';
import { Btn } from '../../components/ui/btn';

type Product = {
  _id: string;
  name: string;
  price: number;
  priceFormatted: string;
  image: string;
  countInStock: number;
  slug: string;
  rating: number;
  category: string;
  brand: string;
  numReviews: number;
  description: string;
};

type ProductPageProps = {
  product?: Product;
  error?: string;
};

const ProductPage: NextPage<ProductPageProps> = ({ product }) => {
  useEffect(() => {
    console.log(product);
  }, []);
  return (
    <>
      <Head>
        <title>
          {APP_NAME} - {product?.name || 'Produto'}
        </title>
      </Head>
      <MainContainer>
        <NextLink href="/" passHref>
          <Link>Ver mais produtos</Link>
        </NextLink>
        <Grid
          gap="6"
          mt="6"
          templateColumns={{ base: '1fr', lg: '2fr 1fr 1fr' }}
        >
          <Image w="100%" src={product?.image} />
          <VStack as="section" gridGap="4" alignItems="flex-start">
            <Heading size="lg" mb="6" fontWeight="thin">
              {product?.name}
            </Heading>
            <PropertyText title="Categoria" text={product?.category} />
            <PropertyText title="Marca" text={product?.brand} />
            <PropertyText
              title="Avaliação"
              text={`${product?.rating} estrelas (${product?.numReviews} avaliações)`}
            />
            <PropertyText title="Descrição" text={product?.description} />
          </VStack>
          <Box as="section">
            <VStack
              p="6"
              bgColor={useColorModeValue('white', 'gray.700')}
              borderRadius="lg"
              w="100%"
              gridGap="3"
            >
              <HStack w="100%">
                <Text as="span" fontWeight="medium" fontSize="xl" w="50%">
                  Preço
                </Text>
                <Text as="span" fontSize="xl" w="50%">
                  {product?.priceFormatted}
                </Text>
              </HStack>
              <HStack w="100%">
                <Text as="span" fontWeight="medium" fontSize="xl" w="50%">
                  Estoque
                </Text>
                <Badge
                  variant="solid"
                  colorScheme={
                    product?.countInStock && product?.countInStock > 0
                      ? 'green'
                      : 'red'
                  }
                  fontSize="1rem"
                >
                  {product?.countInStock}
                </Badge>
              </HStack>
              <Btn>ADICIONAR AO CARRINHO</Btn>
            </VStack>
          </Box>
        </Grid>
      </MainContainer>
    </>
  );
};

const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await request.get('products');

  const paths = data.map((product: Product) => ({
    params: { slug: product.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

const getStaticProps: GetStaticProps = async (ctx) => {
  try {
    const { data } = await request.get(`products/${ctx.params?.slug}`);
    const dataFormatted = {
      ...data,
      priceFormatted: currency.format(data.price),
    };
    return {
      props: { product: dataFormatted },
      revalidate: 60 * 5,
    };
  } catch (ex) {
    const error = ex as Error;
    return {
      props: { error: error.message },
      revalidate: 60 * 5,
    };
  }
};

export { getStaticProps, getStaticPaths };
export default ProductPage;
