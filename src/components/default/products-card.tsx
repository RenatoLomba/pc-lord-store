import React, { FC } from 'react';
import nookies from 'nookies';
import { request } from '../../utils/request';
import { Btn } from '../ui/btn';
import { Card } from '../ui/card';
import { useFetchData } from '../../hooks/useFetchData';
import { Loading } from '../ui/loading';
import { RepeatIcon } from '@chakra-ui/icons';
import { DashCard } from '../ui/dash-card';

type ProductsData = {
  products: {
    count: number;
  };
};

const fetchProductsData = async (): Promise<ProductsData> => {
  const { USER_TOKEN } = nookies.get(null);
  const { data } = await request.get('products/admin/count', {
    headers: { Authorization: 'Bearer ' + USER_TOKEN },
  });

  return data;
};

const ProductsCard: FC = () => {
  const { data, error, isLoading, fetchData } = useFetchData(fetchProductsData);

  return (
    <Card shadow="dark-lg">
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Btn onClick={fetchData}>
          <RepeatIcon />
        </Btn>
      ) : (
        <DashCard
          title="Produtos"
          value={data?.products.count.toString() || ''}
        />
      )}
    </Card>
  );
};

export { ProductsCard };
