import React, { FC } from 'react';
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
  const { data } = await request.get('products/admin/count');

  return data;
};

const ProductsCard: FC = () => {
  const { data, error, isLoading, fetchData } = useFetchData(
    fetchProductsData,
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
        <DashCard
          title="Produtos"
          value={data?.products.count.toString() || ''}
        />
      )}
    </Card>
  );
};

export { ProductsCard };
