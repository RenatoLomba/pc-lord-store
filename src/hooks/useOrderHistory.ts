import nookies from 'nookies';
import { getError } from '../utils/get-error';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/toast';
import { request } from '../utils/request';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { currency } from '../utils/formatter';

type Order = {
  _id: string;
  createdAt: string;
  createdAtFormatted: string;
  totalPrice: number;
  totalPriceFormatted: string;
  isPaid: boolean;
  isDelivered: boolean;
};

const useOrderHistory = () => {
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  const fetchOrders = async () => {
    try {
      const { USER_TOKEN } = nookies.get(null);
      setIsLoading(true);
      setError(undefined);
      const { data } = (await request.get('orders', {
        headers: { Authorization: 'Bearer ' + USER_TOKEN },
      })) as { data: Order[] };

      const ordersResponse: Order[] = data
        .map((order: Order) => ({
          ...order,
          createdAtFormatted: format(parseISO(order.createdAt), 'dd/MM/yyyy', {
            locale: ptBR,
          }),
          totalPriceFormatted: currency.format(order.totalPrice),
        }))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      setOrders(ordersResponse);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        variant: 'solid',
        status: 'error',
        title: 'Erro interno',
        description: getError(error),
        isClosable: true,
      });
    }
  }, [error]);

  return {
    orders,
    isLoading,
    error,
    errorMessage: error && getError(error),
    fetchOrders,
  };
};

export { useOrderHistory };
