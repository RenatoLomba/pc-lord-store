import React from 'react';
import NextLink from 'next/link';
import {
  Icon,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Image,
  Center,
  Link,
  Badge,
  Box,
} from '@chakra-ui/react';
import { MdShoppingBasket, MdClearAll } from 'react-icons/md';
import { CircleButton } from '../ui/circle-button';
import { Drawer } from '../ui/drawer';
import { useCart } from '../../hooks/useCart';
import { Title } from '../ui/title';
import { Btn } from '../ui/btn';
import { useMenu } from '../../hooks/useMenu';
import { SelectCount } from '../ui/select-count';
import { useRouter } from 'next/dist/client/router';
import { useOrder } from '../../hooks/useOrder';

const CartMenu = () => {
  const router = useRouter();
  const { cartItems, removeItem, clearCart, updateQty } = useCart();
  const { openCartMenu, closeCartMenu, isCartMenuOpen } = useMenu();
  const { clearOrder } = useOrder();

  const buttonCartDetailsHandler = () => {
    router.push('/cart');
    closeCartMenu();
  };

  return (
    <>
      <CircleButton onClick={openCartMenu} position="relative">
        <Icon as={MdShoppingBasket} w={6} h={6} color="white" />
        {cartItems.length > 0 && (
          <Badge
            position="absolute"
            top="5px"
            right="0"
            borderRadius="30%"
            bgColor="danger.def"
            color="white"
          >
            {cartItems.length}
          </Badge>
        )}
      </CircleButton>
      <Drawer
        size="lg"
        onClose={closeCartMenu}
        header="Carrinho"
        isOpen={isCartMenuOpen}
        placement="right"
        footer={
          <Box w="100%">
            <Btn onClick={buttonCartDetailsHandler} buttonStyle="success">
              Detalhes do carrinho
            </Btn>
          </Box>
        }
      >
        <Title>Seu carrinho de compras</Title>
        {cartItems.length > 0 ? (
          <>
            <Center mb="6">
              <Btn
                onClick={() => {
                  clearCart();
                  clearOrder();
                }}
                justifySelf="center"
                buttonStyle="warning"
              >
                <Icon as={MdClearAll} w={6} h={6} /> Limpar carrinho
              </Btn>
            </Center>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th textAlign="center">Imagem</Th>
                  <Th>Nome</Th>
                  <Th
                    display={{ base: 'none', lg: 'table-cell' }}
                    textAlign="center"
                  >
                    Qty
                  </Th>
                  <Th textAlign="center">Deletar</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cartItems.map((item) => (
                  <Tr key={item._id}>
                    <Td>
                      <NextLink href={`/product/${item.slug}`} passHref>
                        <Link _focus={{ outline: 0 }} onClick={closeCartMenu}>
                          <Image src={item.image} w={20} h={20} />
                        </Link>
                      </NextLink>
                    </Td>
                    <Td>
                      <NextLink href={`/product/${item.slug}`} passHref>
                        <Link _focus={{ outline: 0 }} onClick={closeCartMenu}>
                          {item.name}
                        </Link>
                      </NextLink>
                    </Td>
                    <Td
                      display={{ base: 'none', lg: 'table-cell' }}
                      textAlign="center"
                    >
                      <SelectCount
                        value={item.qty}
                        onChange={(e) =>
                          updateQty(item._id, Number(e.target.value))
                        }
                        count={item.countInStock}
                      />
                    </Td>
                    <Td textAlign="center">
                      <Btn
                        onClick={() => removeItem(item._id)}
                        buttonStyle="danger"
                      >
                        X
                      </Btn>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        ) : (
          'Carrinho Vazio'
        )}
      </Drawer>
    </>
  );
};

export { CartMenu };
