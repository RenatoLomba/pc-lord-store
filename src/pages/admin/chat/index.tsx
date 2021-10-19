import {
  Box,
  Grid,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
          console.log(rooms);
          const roomsReceived = res.rooms.map((room) => getRoomFormatted(room));
          setRooms(roomsReceived);
        },
      );

      socket?.on('user-entered', (res: { room: Room }) => {
        const newRoom = getRoomFormatted(res.room);
        setRooms((prev) => [...prev, newRoom]);
      });
    });
  }, [socket]);

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
          <Card>
            <Title alignSelf="flex-start">Suporte aos usuários</Title>
            <Table w="100%">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Última atualização</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rooms.map((room) => (
                  <Tr key={room._id}>
                    <Td>
                      <NextLink href={`/admin/chat/${room._id}`}>
                        <Link>{room.user.name}</Link>
                      </NextLink>
                    </Td>
                    <Td>{room.updatedAtFormatted}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </Grid>
      </MainContainer>
    </>
  );
};

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { USER_TOKEN } = nookies.get(ctx);

  if (!USER_TOKEN) {
    return {
      redirect: {
        destination: `/login?redirect=chat`,
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
          destination: '/login?message=Usuário inválido&redirect=chat',
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
