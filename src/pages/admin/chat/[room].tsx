import { Box, Flex, Grid } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import nookies from 'nookies';
import { AdminSidebar } from '../../../components/default/admin-sidebar';
import { Card } from '../../../components/ui/card';
import { MainContainer } from '../../../components/ui/main-container';
import { Title } from '../../../components/ui/title';
import { API_URL, APP_NAME } from '../../../utils/constants';
import { request } from '../../../utils/request';
import { getError } from '../../../utils/get-error';
import { ChatBoxMessages } from '../../../components/ui/chat-box-messages';
import { ChatBoxInput } from '../../../components/ui/chat-box-input';
import { useRouter } from 'next/dist/client/router';
import { useAuth } from '../../../hooks/useAuth';
import io, { Socket } from 'socket.io-client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Btn } from '../../../components/ui/btn';

type Message = {
  senderId: string;
  message: string;
  senderName: string;
  sendTime: string;
  sendTimeFormatted: string;
};

type Room = {
  admin: string;
  user: { _id: string; name: string };
  messages: Message[];
};

const RoomPage: NextPage = () => {
  const { loggedUser } = useAuth();
  const router = useRouter();
  const chatMessagesBoxRef = useRef() as MutableRefObject<HTMLDivElement>;
  const { room: roomId, innactive } = router.query;

  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    if (!chatMessagesBoxRef?.current) return;
    const scrollHeight = chatMessagesBoxRef.current.scrollHeight;
    chatMessagesBoxRef.current.scrollTop = scrollHeight;
  }, [messages]);

  const socket = useMemo<Socket | undefined>(() => {
    if (!loggedUser || !loggedUser?.isAdmin || !!innactive) {
      return;
    }
    return io(`${API_URL}/room`);
  }, [loggedUser]);

  const getMessageFormatted = (msg: Message) => {
    return {
      ...msg,
      sendTimeFormatted: format(new Date(msg.sendTime), 'dd/MM HH:mm', {
        locale: ptBR,
      }),
    };
  };

  useEffect(() => {
    if (!socket) return;

    socket?.on('connect', () => {
      socket?.emit(
        'join-room',
        { adminId: loggedUser?._id, roomId },
        (res: { room: Room }) => {
          setRoom(res.room);
          setMessages(res.room.messages.map((msg) => getMessageFormatted(msg)));
        },
      );

      socket?.on(
        'receive-message',
        ({ newMessage }: { newMessage: Message }) => {
          const newMessageFormatted = getMessageFormatted(newMessage);
          setMessages((prev) => [...prev, newMessageFormatted]);
        },
      );
    });
  }, [socket]);

  useEffect(() => {
    if (!innactive || !loggedUser) return;
    const fetchRoomDataIfInnactive = async () => {
      const { data: room } = await request.get<Room>(`rooms/get_by/${roomId}`);
      setRoom(room);
      const messagesFormatted = room.messages.map((r) =>
        getMessageFormatted(r),
      );
      setMessages(messagesFormatted);
    };
    fetchRoomDataIfInnactive();
  }, [loggedUser]);

  const sendMessageHandler = (message: string) => {
    socket?.emit(
      'send-message',
      { message, id: loggedUser?._id, name: loggedUser?.name, roomId },
      ({ newMessage }: { newMessage: Message }) => {
        const newMessageFormatted = getMessageFormatted(newMessage);
        setMessages((prev) => [...prev, newMessageFormatted]);
      },
    );
  };

  const finishRoomHandler = () => {
    socket?.emit('finish-room', { roomId }, (res: { roomId: string }) => {
      const path = router.asPath;
      router.replace(path + '?innactive=true');
    });
  };

  return (
    <>
      <Head>
        <title>
          {APP_NAME} - Chat com {room?.user?.name}
        </title>
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
            <Flex
              w="100%"
              alignSelf="flex-start"
              justifyContent="space-between"
            >
              <Title>
                Suporte a {room?.user?.name} {innactive && '(Finalizado)'}
              </Title>
              {!innactive && (
                <Btn buttonStyle="danger" onClick={finishRoomHandler}>
                  Finalizar atendimento
                </Btn>
              )}
            </Flex>
            <Box w="100%" h="500px" overflowY="auto" ref={chatMessagesBoxRef}>
              <ChatBoxMessages h="100%" messages={messages} />
            </Box>
            <ChatBoxInput
              disabled={!!innactive}
              sendMessageHandler={sendMessageHandler}
            />
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
      props: {
        user: {
          name: data.user.name,
          email: data.user.email,
          _id: data.user._id,
        },
      },
    };
  } catch (err) {
    return {
      redirect: { destination: `/?message=${getError(err)}`, permanent: false },
    };
  }
};

export { getServerSideProps };
export default RoomPage;
