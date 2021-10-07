import React, { useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
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
  Link,
  Grid,
  VStack,
  Box,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { APP_NAME } from '../utils/constants';
import { MainContainer } from '../components/ui/main-container';
import { Title } from '../components/ui/title';
import { useCart } from '../hooks/useCart';
import { Btn } from '../components/ui/btn';
import { MdClearAll } from 'react-icons/md';
import { currency } from '../utils/formatter';
import { SelectCount } from '../components/ui/select-count';
import { useRouter } from 'next/dist/client/router';
import { Card } from '../components/ui/card';
import { useOrder } from '../hooks/useOrder';
const CartPage: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { cartItems, removeItem, clearCart, updateQty } = useCart();
  const { clearOrder } = useOrder();

  const { message } = router.query;

  useEffect(() => {
    if (message) {
      toast({
        title: 'Erro',
        description: String(message),
        status: 'error',
        variant: 'solid',
        isClosable: true,
      });
    }
  }, []);

  const checkoutOrderHandler = () => {
    router.push('/shipping');
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Seu carrinho</title>
      </Head>
      <MainContainer>
        <Title>Detalhes do carrinho</Title>

        {cartItems.length > 0 ? (
          <>
            <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }}>
              <VStack as="section">
                <Btn
                  onClick={() => {
                    clearCart();
                    clearOrder();
                  }}
                  alignSelf="flex-start"
                  buttonStyle="warning"
                  mb="6"
                >
                  <Icon as={MdClearAll} w={6} h={6} /> Limpar carrinho
                </Btn>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th textAlign="center">Imagem</Th>
                      <Th>Nome</Th>
                      <Th textAlign="center">Qty</Th>
                      <Th textAlign="center">Price</Th>
                      <Th textAlign="center">Deletar</Th>
                      <Th textAlign="center">Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {cartItems.map((item) => (
                      <Tr key={item._id}>
                        <Td
                          textAlign="center"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <NextLink href={`/product/${item.slug}`} passHref>
                            <Link _focus={{ outline: 0 }}>
                              <Image src={item.image} w={20} h={20} />
                            </Link>
                          </NextLink>
                        </Td>
                        <Td>
                          <NextLink href={`/product/${item.slug}`} passHref>
                            <Link _focus={{ outline: 0 }}>{item.name}</Link>
                          </NextLink>
                        </Td>
                        <Td textAlign="center">
                          <SelectCount
                            value={item.qty}
                            onChange={(e) =>
                              updateQty(item._id, Number(e.target.value))
                            }
                            count={item.countInStock}
                          />
                        </Td>
                        <Td textAlign="center" fontWeight="medium">
                          {item.priceFormatted}
                        </Td>
                        <Td textAlign="center">
                          <Btn
                            onClick={() => removeItem(item._id)}
                            buttonStyle="danger"
                          >
                            X
                          </Btn>
                        </Td>
                        <Td textAlign="center" fontWeight="medium">
                          {currency.format(item.price * item.qty)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </VStack>
              <Box as="section">
                <Card>
                  <HStack w="100%">
                    <Text as="span" fontWeight="medium" fontSize="xl" w="50%">
                      SUBTOTAL
                    </Text>
                    <Text as="span" fontSize="xl" w="50%">
                      {currency.format(
                        cartItems.reduce(
                          (prev, curr) => prev + curr.price * curr.qty,
                          0,
                        ),
                      )}
                    </Text>
                  </HStack>
                  <Btn buttonStyle="success" onClick={checkoutOrderHandler}>
                    FINALIZAR PEDIDO
                  </Btn>
                </Card>
              </Box>
            </Grid>
          </>
        ) : (
          <NextLink href="/" passHref>
            <Link>Ver produtos</Link>
          </NextLink>
        )}
      </MainContainer>
    </>
  );
};

export default CartPage;
