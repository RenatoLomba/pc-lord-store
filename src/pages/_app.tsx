import React from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../styles/theme';
import { Header } from '../components/default/header';
import { CartProvider } from '../contexts/cart-context';
import { MenuProvider } from '../contexts/menu-context';
import { AuthProvider } from '../contexts/auth-context';
import { OrderProvider } from '../contexts/order-context';
import { ChatBox } from '../components/ui/chat-box';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <MenuProvider>
          <CartProvider>
            <OrderProvider>
              <Header />
              <Component {...pageProps} />
              <ChatBox />
            </OrderProvider>
          </CartProvider>
        </MenuProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}
export default MyApp;
