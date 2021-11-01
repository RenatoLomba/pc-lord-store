import React, { FC } from 'react';
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
  const { data } = await request.get('orders/admin/count');

  return data;
};

const OrdersCard: FC = () => {
  const { data, error, isLoading, fetchData } = useFetchData(
    fetchOrdersData,
    true,
  );

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
