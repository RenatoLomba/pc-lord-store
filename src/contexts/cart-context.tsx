import { useToast } from '@chakra-ui/toast';
import React, { createContext, FC, useEffect, useState } from 'react';
import nookies from 'nookies';
import { CART_ITEMS_COOKIE } from '../utils/constants';

type CartItem = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  qty: number;
  image: string;
  priceFormatted: string;
  countInStock: number;
  description: string;
  category: string;
};

type CartContextData = {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (_id: string) => void;
  updateQty: (_id: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext({} as CartContextData);

const CartProvider: FC = ({ children }) => {
  const toast = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    const itemAlreadyExist = cartItems.find((it) => it._id === item._id);

    let newItems: CartItem[] = [];

    if (itemAlreadyExist) {
      newItems = cartItems.map((it) => {
        if (it._id === item._id) {
          return {
            ...it,
            qty: it.qty + 1 > it.countInStock ? it.qty : it.qty + 1,
          };
        }

        return it;
      });
    } else {
      newItems = [...cartItems, item];
    }

    nookies.set(null, CART_ITEMS_COOKIE, JSON.stringify(newItems));
    setCartItems(newItems);
  };

  const removeItem = (_id: string) => {
    const itemIndex = cartItems.findIndex((item) => item._id === _id);
    if (itemIndex === -1) {
      toast({
        title: 'Erro',
        description: 'Produto não encontrado no carrinho.',
        variant: 'solid',
        status: 'error',
      });
      return;
    }
    const items = [...cartItems];
    items.splice(itemIndex, 1);

    nookies.set(null, CART_ITEMS_COOKIE, JSON.stringify(items));
    setCartItems(items);
  };

  const updateQty = (_id: string, qty: number) => {
    const item = cartItems.find((item) => item._id === _id);
    if (!item) {
      toast({
        title: 'Erro',
        description: 'Produto não encontrado no carrinho.',
        variant: 'solid',
        status: 'error',
      });
      return;
    }

    const newCartItems = cartItems.map((item) => {
      if (item._id === _id) {
        return { ...item, qty };
      }
      return item;
    });

    nookies.set(null, CART_ITEMS_COOKIE, JSON.stringify(newCartItems));
    setCartItems(newCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
    nookies.destroy(null, CART_ITEMS_COOKIE);
  };

  useEffect(() => {
    const { CART_ITEMS } = nookies.get(null);
    if (!CART_ITEMS) return;
    setCartItems(JSON.parse(CART_ITEMS) as CartItem[]);
  }, []);

  return (
    <CartContext.Provider
      value={{ addItem, cartItems, removeItem, clearCart, updateQty }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
