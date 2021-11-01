import React, { FC } from 'react';
import { request } from '../../utils/request';
import { Btn } from '../ui/btn';
import { Card } from '../ui/card';
import { currency } from '../../utils/formatter';
import { useFetchData } from '../../hooks/useFetchData';
import { Loading } from '../ui/loading';
import { RepeatIcon } from '@chakra-ui/icons';
import { DashCard } from '../ui/dash-card';

type SalesData = {
  orders: {
    total: number;
    totalFormatted: string;
  };
};

const fetchSalesData = async () => {
  const { data } = await request.get('orders/admin/total');

  const salesData: SalesData = {
    orders: {
      ...data.orders,
      totalFormatted: currency.format(data.orders.total),
    },
  };

  return salesData;
};

const SalesCard: FC = () => {
  const { data, error, isLoading, fetchData } = useFetchData(
    fetchSalesData,
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
        <DashCard title="Vendas" value={data?.orders.totalFormatted || ''} />
      )}
    </Card>
  );
};

export { SalesCard };
