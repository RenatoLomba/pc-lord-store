import React, { createContext, FC, useState } from 'react';
import nookies from 'nookies';
import { ADDRESS_INFO_COOKIE, ORDER_ITEMS_COOKIE } from '../utils/constants';

type OrderItem = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  qty: number;
  image: string;
  priceFormatted: string;
  countInStock: number;
};

type AddressInfo = {
  fullname: string;
  address: string;
  number: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
};

type OrderContextData = {
  orderItems: OrderItem[];
  addressInfo?: AddressInfo;
  changeOrderItems: (items: OrderItem[]) => void;
  changeAddressInfo: (info: AddressInfo) => void;
};

const OrderContext = createContext({} as OrderContextData);

const OrderProvider: FC = ({ children }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [addressInfo, setAddressInfo] = useState<AddressInfo>();

  const changeOrderItems = (items: OrderItem[]) => {
    setOrderItems(items);
    nookies.set(null, ORDER_ITEMS_COOKIE, JSON.stringify(items));
  };

  const changeAddressInfo = (info: AddressInfo) => {
    setAddressInfo(info);
    nookies.set(null, ADDRESS_INFO_COOKIE, JSON.stringify(info));
  };

  return (
    <OrderContext.Provider
      value={{ orderItems, changeOrderItems, addressInfo, changeAddressInfo }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext, OrderProvider };
