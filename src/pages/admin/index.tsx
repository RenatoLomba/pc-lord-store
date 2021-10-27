import { Box, Grid, HStack } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import nookies from 'nookies';
import { AdminSidebar } from '../../components/default/admin-sidebar';
import { OrdersCard } from '../../components/default/orders-card';
import { ProductsCard } from '../../components/default/products-card';
import { SalesCard } from '../../components/default/sales-card';
import { SalesChart } from '../../components/default/sales-chart';
import { UsersCard } from '../../components/default/users-card';
import { Card } from '../../components/ui/card';
import { MainContainer } from '../../components/ui/main-container';
import { Title } from '../../components/ui/title';
import { APP_NAME } from '../../utils/constants';
import { getError } from '../../utils/get-error';
import { request } from '../../utils/request';

const DashboardAdmin: NextPage = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME} - Dashboard Admin</title>
      </Head>
      <MainContainer>
        <Grid
          gridGap="2"
          h="100%"
          templateColumns={{ base: '1fr', lg: '1fr 3fr' }}
        >
          <Box>
            <AdminSidebar tabActive="admin" />
          </Box>
          <Card gridGap="6">
            <Title alignSelf="flex-start">Dashboard</Title>
            <HStack justifyContent="center" gridGap="10" w="100%">
              <Box w="25%">
                <SalesCard />
              </Box>
              <Box w="25%">
                <OrdersCard />
              </Box>
              <Box w="25%">
                <ProductsCard />
              </Box>
              <Box w="25%">
                <UsersCard />
              </Box>
            </HStack>
            <Title alignSelf="flex-start">Gráfico de vendas</Title>
            <Box w="75%">
              <SalesChart />
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
      props: {
        user: {
          name: data.user.name,
          email: data.user.email,
          _id: data.user._id,
        },
      },
    };
  } catch (err) {
    return {
      redirect: { destination: `/?message=${getError(err)}`, permanent: false },
    };
  }
};

export { getServerSideProps };
export default DashboardAdmin;
