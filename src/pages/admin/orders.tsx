import {
  Badge,
  Box,
  Grid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import nookies from 'nookies';
import { Card } from '../../components/ui/card';
import { MainContainer } from '../../components/ui/main-container';
import { Title } from '../../components/ui/title';
import { APP_NAME } from '../../utils/constants';
import { getError } from '../../utils/get-error';
import { request } from '../../utils/request';
import { Loading } from '../../components/ui/loading';
import { Btn } from '../../components/ui/btn';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/dist/client/router';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { currency } from '../../utils/formatter';
import { useFetchData } from '../../hooks/useFetchData';
import { AdminSidebar } from '../../components/default/admin-sidebar';

type Order = {
  _id: string;
  createdAt: string;
  createdAtFormatted: string;
  totalPrice: number;
  totalPriceFormatted: string;
  isPaid: boolean;
  isDelivered: boolean;
  user: { name: string };
};

const fetchOrdersFn = async () => {
  const { data } = (await request.get('orders/admin/all')) as { data: Order[] };

  const ordersResponse: Order[] = data
    .map((order: Order) => ({
      ...order,
      createdAtFormatted: format(
        parseISO(order.createdAt),
        'dd/MM/yyyy HH:mm',
        {
          locale: ptBR,
        },
      ),
      totalPriceFormatted: currency.format(order.totalPrice),
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return ordersResponse;
};

const AdminOrders: NextPage = () => {
  const router = useRouter();
  const { data, error, isLoading, fetchData } = useFetchData(
    fetchOrdersFn,
    true,
  );

  const actionsButtonClickHandler = (id: string) => {
    router.push(`/order/${id}`);
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Pedidos</title>
      </Head>
      <MainContainer>
        <Grid
          gridGap="2"
          h="100%"
          templateColumns={{ base: '1fr', lg: '1fr 3fr' }}
        >
          <Box>
            <AdminSidebar tabActive="orders" />
          </Box>
          <Card>
            <Title alignSelf="flex-start">Todos os Pedidos</Title>
            <Box w="100%">
              {isLoading ? (
                <Loading />
              ) : error ? (
                <Btn
                  border="1px solid"
                  borderColor="gray.500"
                  onClick={fetchData}
                >
                  Recarregar
                </Btn>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Usuário</Th>
                      <Th>Data do pedido</Th>
                      <Th>Total</Th>
                      <Th>Pagamento</Th>
                      <Th>Entrega</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.map((order) => (
                      <Tr key={order._id}>
                        <Td>{order.user?.name || 'Usuário inexistente'}</Td>
                        <Td>{order.createdAtFormatted}</Td>
                        <Td>{order.totalPriceFormatted}</Td>
                        <Td>
                          <Badge
                            fontSize="0.8rem"
                            colorScheme={order.isPaid ? 'green' : 'red'}
                          >
                            {order.isPaid ? 'Efetuado' : 'Não efetuado'}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge
                            fontSize="0.8rem"
                            colorScheme={order.isDelivered ? 'green' : 'red'}
                          >
                            {order.isDelivered ? 'Entregue' : 'Não entregue'}
                          </Badge>
                        </Td>
                        <Td>
                          <Btn
                            border="1px solid"
                            borderColor="gray.500"
                            onClick={() => actionsButtonClickHandler(order._id)}
                          >
                            <ExternalLinkIcon />
                          </Btn>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </Card>
        </Grid>
      </MainContainer>
    </>
  );
};

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN } = nookies.get(ctx);
  const { resolvedUrl } = ctx;

  if (!USER_TOKEN) {
    return {
      redirect: {
        destination: `/login?redirect=${resolvedUrl}`,
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
          destination: `/login?message=Usuário inválido&redirect=${resolvedUrl}`,
          permanent: false,
        },
      };
    }

    if (!data?.user?.isAdmin) {
      return {
        redirect: {
          destination: '/?message=Acesso apenas para administradores',
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  } catch (err) {
    return {
      redirect: { destination: `/?message=${getError(err)}`, permanent: false },
    };
  }
};

export { getServerSideProps };
export default AdminOrders;
