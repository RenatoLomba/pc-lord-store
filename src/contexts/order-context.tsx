import React, { createContext, FC, useEffect, useState } from 'react';
import nookies from 'nookies';
import { ADDRESS_INFO_COOKIE, PAYMENT_METHOD_COOKIE } from '../utils/constants';

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
  addressInfo?: AddressInfo;
  paymentMethod?: string;
  changeAddressInfo: (info: AddressInfo) => void;
  changePaymentMethod: (payment: string) => void;
  clearOrder: () => void;
};

const OrderContext = createContext({} as OrderContextData);

const OrderProvider: FC = ({ children }) => {
  const [addressInfo, setAddressInfo] = useState<AddressInfo>();
  const [paymentMethod, setPaymentMethod] = useState('');

  const changeAddressInfo = (info: AddressInfo) => {
    setAddressInfo(info);
    nookies.set(null, ADDRESS_INFO_COOKIE, JSON.stringify(info));
  };

  const changePaymentMethod = (payment: string) => {
    setPaymentMethod(payment);
    nookies.set(null, PAYMENT_METHOD_COOKIE, payment);
  };

  const clearOrder = () => {
    setAddressInfo(undefined);
    setPaymentMethod('');
    nookies.destroy(null, ADDRESS_INFO_COOKIE);
    nookies.destroy(null, PAYMENT_METHOD_COOKIE);
  };

  useEffect(() => {
    const { PAYMENT_METHOD } = nookies.get(null);
    if (!PAYMENT_METHOD) return;
    setPaymentMethod(PAYMENT_METHOD);
  }, []);

  useEffect(() => {
    const { ADDRESS_INFO } = nookies.get(null);
    if (!ADDRESS_INFO) return;
    const addressInfo = JSON.parse(ADDRESS_INFO);
    setAddressInfo(addressInfo);
  }, []);

  return (
    <OrderContext.Provider
      value={{
        addressInfo,
        changeAddressInfo,
        paymentMethod,
        changePaymentMethod,
        clearOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext, OrderProvider };
