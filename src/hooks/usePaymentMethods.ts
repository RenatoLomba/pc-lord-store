import useSWR from 'swr';
import { getError } from '../utils/get-error';

type PaymentMethod = {
  id: string;
  name: string;
  payment_type_id: string;
  status: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const usePaymentMethods = () => {
  const { data, error } = useSWR<PaymentMethod[]>(
    '/api/payment_methods',
    fetcher,
  );

  return {
    payment_methods: data,
    isLoading: !error && !data,
    isError: error,
    errorMessage: error && getError(error),
  };
};

export { usePaymentMethods };
