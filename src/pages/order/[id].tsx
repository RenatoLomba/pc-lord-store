import React, { useEffect, useRef, useState } from 'react';
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
  Badge,
  Flex,
  useToast,
  Box,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import nookies from 'nookies';
import { Card } from '../../components/ui/card';
import { MainContainer } from '../../components/ui/main-container';
import { Title } from '../../components/ui/title';
import { APP_NAME } from '../../utils/constants';
import { currency } from '../../utils/formatter';
import { getError } from '../../utils/get-error';
import { request } from '../../utils/request';
import { useRouter } from 'next/dist/client/router';
import axios from 'axios';

type OrderItem = {
  _id: string;
  name: string;
  image: string;
  price: number;
  priceFormatted: string;
  qty: number;
  slug: string;
  description: string;
};

type Address = {
  firstName: string;
  lastName: string;
  state: string;
  address: string;
  number: number;
  city: string;
  postalCode: string;
  country: string;
};

type Order = {
  isDelivered: boolean;
  isPaid: boolean;
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: Address;
  fullAddress: string;
  paymentMethod: string;
  itemsPrice: number;
  itemsPriceFormatted: string;
  shippingPrice: number;
  shippingPriceFormatted: string;
  taxPrice: number;
  taxPriceFormatted: string;
  totalPrice: number;
  totalPriceFormatted: string;
};

type OrderPageProps = {
  order: Order;
};

type PaypalButtonsProps = {
  createOrder: (data: any, actions: any) => any;
  onApprove: (data: any, actions: any) => Promise<any>;
};

declare global {
  interface Window {
    paypal: {
      Buttons: (props: PaypalButtonsProps) => { render: (ref: any) => void };
    };
  }
}

const OrderPage: NextPage<OrderPageProps> = ({ order }) => {
  const toast = useToast();
  const router = useRouter();
  const orderIsDelivered = order.isDelivered;
  const orderIsPaid = order.isPaid;
  const [loaded, setLoaded] = useState(false);

  let paypalRef = useRef() as any;

  useEffect(() => {
    if (order.isPaid) return;

    const getClientId = async (): Promise<string> => {
      const { USER_TOKEN } = nookies.get(null);
      const { data } = await axios.get('/api/get_client_id', {
        headers: { Authorization: 'Bearer ' + USER_TOKEN },
      });
      return data.clientId;
    };

    const createPayPalScript = async () => {
      const clientId = await getClientId();

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?currency=BRL&client-id=${clientId}`;

      script.addEventListener('load', () => setLoaded(true));

      document.body.appendChild(script);
    };

    try {
      createPayPalScript();
    } catch (err) {
      toast({
        variant: 'solid',
        status: 'error',
        isClosable: true,
        title: 'Erro interno',
        description: getError(err),
      });
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      const loadPaymentButtons = () => {
        setTimeout(() => {
          window.paypal
            .Buttons({
              createOrder: (data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      description: `Order ${order._id}`,
                      amount: {
                        currency_code: 'BRL',
                        value: order.totalPrice,
                      },
                    },
                  ],
                });
              },
              onApprove: async (data, actions) => {
                const orderPaypal = await actions.order.capture();

                console.log(orderPaypal);
                const { USER_TOKEN } = nookies.get(null);

                if (!USER_TOKEN) {
                  toast({
                    variant: 'solid',
                    status: 'error',
                    isClosable: true,
                    title: 'Erro',
                    description: 'Usuário não está autenticado',
                  });
                  return;
                }

                try {
                  await request.put(`orders/${order._id}/pay`);
                } catch (err) {
                  toast({
                    variant: 'solid',
                    status: 'error',
                    isClosable: true,
                    title: 'Erro interno',
                    description: getError(err),
                  });
                }

                router.replace(router.asPath);
              },
            } as PaypalButtonsProps)
            .render(paypalRef);
        });
      };

      loadPaymentButtons();
    }
  }, [loaded]);

  return (
    <>
      <Head>
        <title>
          {APP_NAME} - Pedido {order._id}
        </title>
      </Head>
      <MainContainer>
        <Title>Pedido {order._id}</Title>
        <Grid gridGap="2" templateColumns={{ base: '1fr', lg: '3fr 1fr' }}>
          <VStack as="section">
            <Card alignItems="flex-start">
              <Heading size="xl" fontWeight="medium">
                Endereço de entrega
              </Heading>
              <Text fontSize="lg">{order.fullAddress}</Text>
              <Flex gridGap="3" alignItems="center">
                Status:{' '}
                <Badge
                  fontSize="1rem"
                  colorScheme={orderIsDelivered ? 'green' : 'red'}
                >
                  {orderIsDelivered ? 'Entregue' : 'Não entregue'}
                </Badge>
              </Flex>
            </Card>
            <Card alignItems="flex-start">
              <Heading size="xl" fontWeight="medium">
                Forma de pagamento
              </Heading>
              <Text fontSize="lg">{order.paymentMethod}</Text>
              <Flex gridGap="3" alignItems="center">
                Status:{' '}
                <Badge
                  fontSize="1rem"
                  colorScheme={orderIsPaid ? 'green' : 'red'}
                >
                  {orderIsPaid
                    ? 'Pagamento processado'
                    : 'Pagamento não processado'}
                </Badge>
              </Flex>
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
                  {order.orderItems.map((item) => (
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
                {order.itemsPriceFormatted}
              </Text>
            </HStack>
            <HStack justifyContent="space-between" w="100%">
              <Text fontSize="xl" as="strong">
                Frete
              </Text>
              <Text fontSize="lg" as="span">
                {order.shippingPriceFormatted}
              </Text>
            </HStack>
            <HStack justifyContent="space-between" w="100%">
              <Text fontSize="xl" as="strong">
                Impostos
              </Text>
              <Text fontSize="lg" as="span">
                {order.taxPriceFormatted}
              </Text>
            </HStack>
            <HStack justifyContent="space-between" w="100%">
              <Text fontSize="xl" as="strong">
                Total
              </Text>
              <Text fontSize="lg" as="span">
                {order.totalPriceFormatted}
              </Text>
            </HStack>
            {!order.isPaid && <Box w="100%" ref={(v) => (paypalRef = v)} />}
          </Card>
        </Grid>
      </MainContainer>
    </>
  );
};

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN } = nookies.get(ctx);
  const params = ctx.params;

  if (!params) {
    return {
      redirect: { destination: '/?message=Acesso inválido', permanent: false },
    };
  }

  if (!USER_TOKEN) {
    return {
      redirect: {
        destination: `/login?redirect=order/${params.id}`,
        permanent: false,
      },
    };
  }

  try {
    const authenticateUser = async (): Promise<boolean> => {
      const { data } = await request.get('auth', {
        headers: { Authorization: 'Bearer ' + USER_TOKEN },
      });
      return data?.isValid || false;
    };
    const isAuthenticated = await authenticateUser();
    if (!isAuthenticated) {
      return {
        redirect: {
          destination: '/login?message=Usuário inválido&redirect=placeorder',
          permanent: false,
        },
      };
    }

    const getOrderData = async (): Promise<any> => {
      const { data } = await request.get(`orders/${params.id}`, {
        headers: { Authorization: 'Bearer ' + USER_TOKEN },
      });
      return data;
    };
    const orderData = await getOrderData();

    const order: Order = {
      ...orderData,
      orderItems: orderData.orderItems.map((item: any) => ({
        ...item,
        priceFormatted: currency.format(item.price),
      })),
      fullAddress: `${orderData.shippingAddress?.firstName} ${orderData.shippingAddress?.lastName}, ${orderData.shippingAddress?.address} nº ${orderData.shippingAddress?.number} - ${orderData.shippingAddress?.city}, ${orderData.shippingAddress?.state} - ${orderData.shippingAddress?.postalCode}`,
      itemsPriceFormatted: currency.format(orderData.itemsPrice),
      shippingPriceFormatted: currency.format(orderData.shippingPrice),
      taxPriceFormatted: currency.format(orderData.taxPrice),
      totalPriceFormatted: currency.format(orderData.totalPrice),
    };

    return { props: { order } };
  } catch (err) {
    return {
      redirect: { destination: `/?message=${getError(err)}`, permanent: false },
    };
  }
};

export { getServerSideProps };
export default OrderPage;
