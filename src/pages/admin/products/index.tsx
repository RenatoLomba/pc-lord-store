import {
  Box,
  Flex,
  Grid,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import React, { useState } from 'react';
import nookies from 'nookies';
import { Card } from '../../../components/ui/card';
import { MainContainer } from '../../../components/ui/main-container';
import { Title } from '../../../components/ui/title';
import { APP_NAME } from '../../../utils/constants';
import { getError } from '../../../utils/get-error';
import { request } from '../../../utils/request';
import { Loading } from '../../../components/ui/loading';
import { Btn } from '../../../components/ui/btn';
import { currency } from '../../../utils/formatter';
import { useFetchData } from '../../../hooks/useFetchData';
import { AdminSidebar } from '../../../components/default/admin-sidebar';
import { useRouter } from 'next/dist/client/router';
import { Dialog } from '../../../components/ui/dialog';

type Product = {
  _id: string;
  name: string;
  price: number;
  priceFormatted: string;
  category: string;
  countInStock: number;
  rating: number;
  createdAt: string;
  slug: string;
};

const fetchProducts = async () => {
  const { data } = (await request.get('products')) as { data: Product[] };

  const products: Product[] = data
    .map((product) => ({
      ...product,
      priceFormatted: currency.format(product.price),
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return products;
};

const AdminProductsPage: NextPage = () => {
  const toast = useToast();
  const router = useRouter();
  const { data, error, isLoading, fetchData } = useFetchData(fetchProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState('');

  const editProductHandler = (slug: string) => {
    router.push(`/admin/products/form?slug=${slug}`);
  };

  const deleteProductHandler = async (id: string) => {
    try {
      await request.delete(`products/${id}`);

      setDialogOpen(false);

      toast({
        title: 'Sucesso',
        description: `Produto deletado`,
        status: 'success',
        isClosable: true,
      });

      fetchData();
    } catch (ex: any) {
      toast({
        title: ex.response?.data?.error || 'Erro interno',
        description: getError(ex),
        status: 'error',
        variant: 'solid',
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Produtos</title>
      </Head>
      <MainContainer>
        <Grid
          gridGap="2"
          h="100%"
          templateColumns={{ base: '1fr', lg: '1fr 3fr' }}
        >
          <Box>
            <AdminSidebar tabActive="products" />
          </Box>
          <Card>
            <Flex
              w="100%"
              alignSelf="flex-start"
              justifyContent="space-between"
            >
              <Title>Todos os Produtos</Title>
              <Btn
                onClick={() => {
                  router.push('/admin/products/form');
                }}
              >
                Criar produto
              </Btn>
            </Flex>
            <Box w="100%">
              {isLoading ? (
                <Loading />
              ) : error ? (
                <Btn
                  border="1px solid"
                  borderColor="gray.500"
                  onClick={fetchData}
                >
                  Recarregar
                </Btn>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Nome</Th>
                      <Th>Preço</Th>
                      <Th>Categoria</Th>
                      <Th>Em estoque</Th>
                      <Th>Avaliação</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.map((prod) => (
                      <Tr key={prod._id}>
                        <Td>
                          <NextLink href={`/product/${prod.slug}`} passHref>
                            <Link>{prod.name}</Link>
                          </NextLink>
                        </Td>
                        <Td>{prod.priceFormatted}</Td>
                        <Td>{prod.category}</Td>
                        <Td>{prod.countInStock}</Td>
                        <Td>{prod.rating}</Td>
                        <Td>
                          <Btn
                            marginRight="1"
                            onClick={() => editProductHandler(prod.slug)}
                            buttonStyle="warning"
                          >
                            Editar
                          </Btn>
                          <Btn
                            onClick={() => {
                              setProductToDelete(prod._id);
                              setDialogOpen(true);
                            }}
                            buttonStyle="danger"
                          >
                            Deletar
                          </Btn>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </Card>
        </Grid>
      </MainContainer>
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => deleteProductHandler(productToDelete)}
      />
    </>
  );
};

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN } = nookies.get(ctx);
  const { resolvedUrl } = ctx;

  if (!USER_TOKEN) {
    return {
      redirect: {
        destination: `/login?redirect=${resolvedUrl}`,
        permanent: false,
      },
    };
  }

  try {
    const { data } = await request.get('auth', {
      headers: { Authorization: 'Bearer ' + USER_TOKEN },
    });

    if (!data?.isValid) {
      return {
        redirect: {
          destination: `/login?message=Usuário inválido&redirect=${resolvedUrl}`,
          permanent: false,
        },
      };
    }

    if (!data?.user?.isAdmin) {
      return {
        redirect: {
          destination: '/?message=Acesso apenas para administradores',
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  } catch (err) {
    return {
      redirect: { destination: `/?message=${getError(err)}`, permanent: false },
    };
  }
};

export { getServerSideProps };
export default AdminProductsPage;
