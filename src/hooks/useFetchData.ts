import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getError } from '../utils/get-error';
import { useAuth } from './useAuth';

const useFetchData = <T>(fn: () => Promise<T>, isAuth = false) => {
  const toast = useToast();
  const { loggedUser } = useAuth();
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

  useEffect(
    () => {
      if (isAuth && !loggedUser) return;
      fetchData();
    },
    isAuth ? [loggedUser] : [],
  );

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
