import { Box, Grid, HStack } from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
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

export default DashboardAdmin;
