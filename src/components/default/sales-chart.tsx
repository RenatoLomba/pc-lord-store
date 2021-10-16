import React, { FC } from 'react';
import nookies from 'nookies';
import { RepeatIcon } from '@chakra-ui/icons';
import { Bar } from 'react-chartjs-2';
import { request } from '../../utils/request';
import { useFetchData } from '../../hooks/useFetchData';
import { Loading } from '../ui/loading';
import { Btn } from '../ui/btn';

type SalesData = { _id: string; totalSales: number }[];

const fetchSalesData = async (): Promise<SalesData> => {
  const { USER_TOKEN } = nookies.get(null);
  const { data } = await request.get('orders/admin/sales', {
    headers: { Authorization: 'Bearer ' + USER_TOKEN },
  });

  return data.orders.salesData;
};

const SalesChart: FC = () => {
  const { data, isLoading, error, fetchData } = useFetchData(fetchSalesData);

  if (isLoading) {
    return <Loading />;
  } else if (error) {
    return (
      <Btn onClick={fetchData}>
        <RepeatIcon />
      </Btn>
    );
  } else {
    return (
      <Bar
        data={{
          labels: data?.map((x) => x._id),
          datasets: [
            {
              label: 'Vendas',
              backgroundColor: 'rgba(162,222,208, 1)',
              data: data?.map((x) => x.totalSales) || [],
            },
          ],
        }}
      />
    );
  }
};

export { SalesChart };
