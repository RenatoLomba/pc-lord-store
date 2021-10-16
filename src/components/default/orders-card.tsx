import React, { FC } from 'react';
import nookies from 'nookies';
import { request } from '../../utils/request';
import { Btn } from '../ui/btn';
import { Card } from '../ui/card';
import { useFetchData } from '../../hooks/useFetchData';
import { Loading } from '../ui/loading';
import { RepeatIcon } from '@chakra-ui/icons';
import { DashCard } from '../ui/dash-card';

type OrdersData = {
  orders: {
    count: number;
  };
};

const fetchOrdersData = async (): Promise<OrdersData> => {
  const { USER_TOKEN } = nookies.get(null);
  const { data } = await request.get('orders/admin/count', {
    headers: { Authorization: 'Bearer ' + USER_TOKEN },
  });

  return data;
};

const OrdersCard: FC = () => {
  const { data, error, isLoading, fetchData } = useFetchData(fetchOrdersData);

  return (
    <Card shadow="dark-lg">
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Btn onClick={fetchData}>
          <RepeatIcon />
        </Btn>
      ) : (
        <DashCard title="Pedidos" value={data?.orders.count.toString() || ''} />
      )}
    </Card>
  );
};

export { OrdersCard };
