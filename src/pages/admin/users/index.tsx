import {
  Badge,
  Box,
  Grid,
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
import { useFetchData } from '../../../hooks/useFetchData';
import { AdminSidebar } from '../../../components/default/admin-sidebar';
import { Dialog } from '../../../components/ui/dialog';

type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
};

const fetchUsers = async () => {
  const { data } = (await request.get('users')) as { data: User[] };

  const users: User[] = data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return users;
};

const AdminUsersPage: NextPage = () => {
  const toast = useToast();
  const { data, error, isLoading, fetchData } = useFetchData(fetchUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState('');

  const deleteUserHandler = async (id: string) => {
    try {
      await request.delete(`users/${id}`);

      setDialogOpen(false);

      toast({
        title: 'Sucesso',
        description: `Usuário deletado`,
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
        <title>{APP_NAME} - Usuários</title>
      </Head>
      <MainContainer>
        <Grid
          gridGap="2"
          h="100%"
          templateColumns={{ base: '1fr', lg: '1fr 3fr' }}
        >
          <Box>
            <AdminSidebar tabActive="users" />
          </Box>
          <Card>
            <Title alignSelf="flex-start">Todos os Usuários</Title>
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
                      <Th>Email</Th>
                      <Th>Administrador</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.map((user) => (
                      <Tr key={user._id}>
                        <Td>{user.name}</Td>
                        <Td>{user.email}</Td>
                        <Td>
                          <Badge
                            fontSize="0.8rem"
                            colorScheme={user.isAdmin ? 'green' : 'red'}
                          >
                            {user.isAdmin ? 'Sim' : 'Não'}
                          </Badge>
                        </Td>
                        <Td>
                          <Btn
                            onClick={() => {
                              setUserToDelete(user._id);
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
        onConfirm={() => deleteUserHandler(userToDelete)}
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
export default AdminUsersPage;
