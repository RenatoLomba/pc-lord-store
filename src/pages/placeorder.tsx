import React, { useEffect, useState } from 'react';
import {
  Grid,
  Heading,
  VStack,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
  Image,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import nookies from 'nookies';
import { Card } from '../components/ui/card';
import { MainContainer } from '../components/ui/main-container';
import { Title } from '../components/ui/title';
import { useCart } from '../hooks/useCart';
import { useOrder } from '../hooks/useOrder';
import { APP_NAME } from '../utils/constants';
import { currency } from '../utils/formatter';
import { Btn } from '../components/ui/btn';
import { useRouter } from 'next/dist/client/router';
import { getError } from '../utils/get-error';
import { request } from '../utils/request';
import { Loading } from '../components/ui/loading';

const PlaceorderPage: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { cartItems, clearCart } = useCart();
  const { addressInfo, paymentMethod, clearOrder } = useOrder();
  const [isLoading, setIsLoading] = useState(false);

  const { message } = router.query;

  const fullAddress = `${addressInfo?.firstName} ${addressInfo?.lastName}, ${addressInfo?.address}, nº ${addressInfo?.number} - ${addressInfo?.city}, ${addressInfo?.state} - ${addressInfo?.postalCode}`;

  const itemsPrice = cartItems.reduce(
    (prev, curr) => prev + curr.price * curr.qty,
    0,
  );
  const itemsPriceFormatted = currency.format(itemsPrice);

  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const shippingPriceFormatted = currency.format(shippingPrice);

  const taxPrice = (itemsPrice * 2) / 100;
  const taxPriceFormatted = currency.format(taxPrice);

  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  const totalPriceFormatted = currency.format(totalPrice);

  const saveOrder = async () => {
    const { data } = await request.post('orders', {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        image: item.image,
        price: item.price,
        description: item.description,
        qty: item.qty,
        slug: item.slug,
      })),
      shippingAddress: {
        firstName: addressInfo?.firstName,
        lastName: addressInfo?.lastName,
        address: addressInfo?.address,
        number: addressInfo?.number,
        city: addressInfo?.city,
        state: addressInfo?.state,
        postalCode: addressInfo?.postalCode,
        country: addressInfo?.state,
      },
      paymentMethod: paymentMethod?.id || 'PayPal',
      itemsPrice: Number(itemsPrice.toFixed(2)),
      shippingPrice:
        shippingPrice === 0 ? 0.01 : Number(shippingPrice.toFixed(2)),
      taxPrice: Number(taxPrice.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2)),
    });
    return data;
  };

  const finishOrderHandler = async () => {
    try {
      setIsLoading(true);

      const savedOrder = await saveOrder();

      clearCart();
      clearOrder();
      router.push(`/order/${savedOrder._id}`);
    } catch (err: any) {
      toast({
        title: err.response?.data?.error || 'Erro interno',
        description: getError(err),
        status: 'error',
        variant: 'solid',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <title>{APP_NAME} - Fazer pedido</title>
      </Head>
      <MainContainer>
        <Title>Finalizar compra</Title>
        <Grid gridGap="2" templateColumns={{ base: '1fr', lg: '3fr 1fr' }}>
          <VStack as="section">
            <Card alignItems="flex-start">
              <Heading size="xl" fontWeight="medium">
                Endereço de entrega
              </Heading>
              <Text fontSize="lg">{fullAddress}</Text>
            </Card>
            <Card alignItems="flex-start">
              <Heading size="xl" fontWeight="medium">
                Itens do pedido
              </Heading>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th textAlign="center">Imagem</Th>
                    <Th>Nome</Th>
                    <Th textAlign="center">Qty</Th>
                    <Th textAlign="center">Price</Th>
                    <Th textAlign="center">Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {cartItems.map((item) => (
                    <Tr key={item._id}>
                      <Td
                        textAlign="center"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link _focus={{ outline: 0 }}>
                            <Image src={item.image} w={20} h={20} />
                          </Link>
                        </NextLink>
                      </Td>
                      <Td>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link _focus={{ outline: 0 }}>{item.name}</Link>
                        </NextLink>
                      </Td>
                      <Td textAlign="center">{item.qty}</Td>
                      <Td textAlign="center" fontWeight="medium">
                        {item.priceFormatted}
                      </Td>
                      <Td textAlign="center" fontWeight="medium">
                        {currency.format(item.price * item.qty)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Card>
          </VStack>
          <Card gridGap="6">
            <Heading size="xl" fontWeight="medium">
              Totais do pedido
            </Heading>
            <HStack justifyContent="space-between" w="100%">
              <Text fontSize="xl" as="strong">
                Itens
              </Text>
              <Text fontSize="lg" as="span">
                {itemsPriceFormatted}
              </Text>
            </HStack>
            <HStack justifyContent="space-between" w="100%">
              <Text fontSize="xl" as="strong">
                Frete
              </Text>
              <Text fontSize="lg" as="span">
                {shippingPriceFormatted}
              </Text>
            </HStack>
            <HStack justifyContent="space-between" w="100%">
              <Text fontSize="xl" as="strong">
                Impostos
              </Text>
              <Text fontSize="lg" as="span">
                {taxPriceFormatted}
              </Text>
            </HStack>
            <HStack justifyContent="space-between" w="100%">
              <Text fontSize="xl" as="strong">
                Total
              </Text>
              <Text fontSize="lg" as="span">
                {totalPriceFormatted}
              </Text>
            </HStack>
            <Btn
              w="100%"
              buttonStyle="primary"
              border="1px solid"
              borderColor="gray.500"
              onClick={finishOrderHandler}
            >
              Criar pedido
            </Btn>
            {isLoading && <Loading />}
          </Card>
        </Grid>
      </MainContainer>
    </>
  );
};

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN, CART_ITEMS, ADDRESS_INFO } = nookies.get(ctx);

  if (!USER_TOKEN) {
    return {
      redirect: { destination: '/login?redirect=placeorder', permanent: false },
    };
  }

  if (!CART_ITEMS || JSON.parse(CART_ITEMS).length === 0) {
    return {
      redirect: {
        destination: '/?message=Carrinho de compras vazio',
        permanent: false,
      },
    };
  }

  if (!ADDRESS_INFO) {
    return {
      redirect: {
        destination: '/shipping?message=Endereço de entrega não informado',
        permanent: false,
      },
    };
  }

  try {
    const { data } = await request.get('auth', {
      headers: { Authorization: 'Bearer ' + USER_TOKEN },
    });
    if (!data?.isValid) {
      return {
        redirect: {
          destination: '/login?message=Usuário inválido&redirect=placeorder',
          permanent: false,
        },
      };
    }

    return { props: {} };
  } catch (err) {
    return {
      redirect: { destination: `/?message=${getError(err)}`, permanent: false },
    };
  }
};

export { getServerSideProps };
export default PlaceorderPage;
