import { useContext } from 'react';
import { OrderContext } from '../contexts/order-context';

const useOrder = () => {
  return useContext(OrderContext);
};

export { useOrder };
