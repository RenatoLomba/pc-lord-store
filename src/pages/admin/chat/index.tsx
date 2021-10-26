import {
  Box,
  Grid,
  Heading,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import React, { useEffect, useMemo, useState } from 'react';
import nookies from 'nookies';
import { AdminSidebar } from '../../../components/default/admin-sidebar';
import { Card } from '../../../components/ui/card';
import { MainContainer } from '../../../components/ui/main-container';
import { Title } from '../../../components/ui/title';
import { API_URL, APP_NAME } from '../../../utils/constants';
import { request } from '../../../utils/request';
import { getError } from '../../../utils/get-error';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../../hooks/useAuth';

type Room = {
  isActive: boolean;
  updatedAt: string;
  updatedAtFormatted: string;
  _id: string;
  user: { _id: string; name: string };
};

const ChatPage: NextPage = () => {
  const { loggedUser } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [adminRooms, setAdminRooms] = useState<Room[]>([]);
  const [innactiveRooms, setInnactiveRooms] = useState<Room[]>([]);
  const bgHoverStyle = useColorModeValue('gray.100', 'gray.600');

  const socket = useMemo<Socket | undefined>(() => {
    if (!loggedUser || !loggedUser?.isAdmin) {
      return;
    }
    return io(`${API_URL}/room`);
  }, [loggedUser]);

  const getRoomFormatted = (data: Room) => {
    return {
      ...data,
      updatedAtFormatted: format(new Date(data.updatedAt), 'dd/MM/yyyy HH:mm', {
        locale: ptBR,
      }),
    };
  };

  useEffect(() => {
    socket?.on('connect', () => {
      socket?.emit(
        'show-rooms',
        { adminId: loggedUser?._id },
        (res: { rooms: Room[] }) => {
          const roomsReceived = res.rooms.map((room) => getRoomFormatted(room));
          setRooms(roomsReceived);
        },
      );

      socket?.on('user-entered', (res: { room: Room }) => {
        const newRoom = getRoomFormatted(res.room);
        setRooms((prev) => [...prev, newRoom]);
      });

      socket?.emit(
        'show-admin-rooms',
        { adminId: loggedUser?._id },
        (res: { rooms: Room[] }) => {
          const { rooms: roomsReceived } = res;
          setAdminRooms(roomsReceived.map((room) => getRoomFormatted(room)));
        },
      );
    });
  }, [socket]);

  useEffect(() => {
    if (!loggedUser) return;

    const fetchInnactiveRooms = async () => {
      const { data } = await request.get<Room[]>('rooms/innactive');
      const rooms = data.map((r) => getRoomFormatted(r));
      setInnactiveRooms(rooms);
    };

    fetchInnactiveRooms();
  }, [loggedUser]);

  return (
    <>
      <Head>
        <title>{APP_NAME} - Chat</title>
      </Head>
      <MainContainer>
        <Grid
          gridGap="2"
          h="100%"
          templateColumns={{ base: '1fr', lg: '1fr 3fr' }}
        >
          <Box>
            <AdminSidebar tabActive="chat" />
          </Box>
          <Card alignItems="flex-start">
            <Title alignSelf="flex-start">Suporte aos usuários</Title>
            <Heading color="warning.def" fontWeight="medium" fontSize="2xl">
              Em andamento
            </Heading>
            {adminRooms.length > 0 ? (
              <Table w="100%">
                <Thead>
                  <Tr>
                    <Th>Nome</Th>
                    <Th>Última atualização</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {adminRooms.map((room) => (
                    <NextLink
                      key={room._id}
                      href={`/admin/chat/${room._id}`}
                      passHref
                    >
                      <Tr
                        cursor="pointer"
                        transition="background-color 0.1s ease-in-out"
                        _hover={{ bgColor: bgHoverStyle }}
                      >
                        <Td>
                          <Link>{room.user.name}</Link>
                        </Td>
                        <Td>{room.updatedAtFormatted}</Td>
                      </Tr>
                    </NextLink>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>Nenhum atendimento em andamento no momento</Text>
            )}

            <Heading color="success.def" fontWeight="medium" fontSize="2xl">
              Disponíveis
            </Heading>

            {rooms.length > 0 ? (
              <Table w="100%">
                <Thead>
                  <Tr>
                    <Th>Nome</Th>
                    <Th>Última atualização</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {rooms.map((room) => (
                    <NextLink
                      key={room._id}
                      href={`/admin/chat/${room._id}`}
                      passHref
                    >
                      <Tr
                        cursor="pointer"
                        transition="background-color 0.1s ease-in-out"
                        _hover={{ bgColor: bgHoverStyle }}
                      >
                        <Td>
                          <Link>{room.user.name}</Link>
                        </Td>
                        <Td>{room.updatedAtFormatted}</Td>
                      </Tr>
                    </NextLink>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>Nenhum atendimento disponível no momento</Text>
            )}

            <Heading color="danger.def" fontWeight="medium" fontSize="2xl">
              Finalizados
            </Heading>

            {innactiveRooms.length > 0 ? (
              <Table w="100%">
                <Thead>
                  <Tr>
                    <Th>Nome</Th>
                    <Th>Última atualização</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {innactiveRooms.map((room) => (
                    <NextLink
                      key={room._id}
                      href={`/admin/chat/${room._id}?innactive=true`}
                      passHref
                    >
                      <Tr
                        cursor="pointer"
                        transition="background-color 0.1s ease-in-out"
                        _hover={{ bgColor: bgHoverStyle }}
                      >
                        <Td>
                          <Link>{room.user.name}</Link>
                        </Td>
                        <Td>{room.updatedAtFormatted}</Td>
                      </Tr>
                    </NextLink>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>Nenhum atendimento disponível no momento</Text>
            )}
          </Card>
        </Grid>
      </MainContainer>
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
export default ChatPage;
