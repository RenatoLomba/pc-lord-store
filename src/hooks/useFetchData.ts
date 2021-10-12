import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getError } from '../utils/get-error';

const useFetchData = <T>(fn: () => Promise<T>) => {
  const toast = useToast();
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(undefined);

      const dataFetched = await fn();

      setData(dataFetched);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    data,
    isLoading,
    error,
    errorMessage: error && getError(error),
    fetchData,
  };
};
export { useFetchData };
