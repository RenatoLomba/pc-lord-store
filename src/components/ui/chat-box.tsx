import { ChatIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/dist/client/router';
import React, {
  FC,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../hooks/useAuth';
import { API_URL } from '../../utils/constants';
import { Btn } from './btn';
import { ChatBoxInput } from './chat-box-input';
import { ChatBoxMessages } from './chat-box-messages';

type Message = {
  senderId: string;
  message: string;
  senderName: string;
  sendTime: string;
  sendTimeFormatted: string;
};

const ChatBox: FC = () => {
  const router = useRouter();
  const { loggedUser } = useAuth();

  const [roomId, setRoomId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const bgStyle = useColorModeValue('gray.100', 'gray.800');

  const socket = useMemo<Socket | undefined>(() => {
    if (!loggedUser || loggedUser?.isAdmin || !isOpen) {
      return;
    }
    return io(`${API_URL}/room`);
  }, [loggedUser, isOpen]);

  const chatMessagesBoxRef = useRef() as MutableRefObject<HTMLDivElement>;

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!chatMessagesBoxRef?.current) return;
    const scrollHeight = chatMessagesBoxRef.current.scrollHeight;
    chatMessagesBoxRef.current.scrollTop = scrollHeight;
  }, [messages, isOpen]);

  const getMessageFormatted = (msg: Message) => {
    return {
      ...msg,
      sendTimeFormatted: format(new Date(msg.sendTime), 'dd/MM HH:mm', {
        locale: ptBR,
      }),
    };
  };

  useEffect(() => {
    socket?.on('connect', () => {
      socket?.emit(
        'enter-room',
        { userId: loggedUser?._id },
        (res: { roomId: string; messages: Message[] }) => {
          setRoomId(res.roomId);
          setMessages(res.messages.map((msg) => getMessageFormatted(msg)));
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

  useEffect(() => {
    if (loggedUser && messages.length > 0) {
      open();
    }
  }, [loggedUser, messages]);

  const signInHandler = () => {
    close();
    const path = router.asPath;
    router.push(`/login?redirect=${path.replace('/', '')}`);
  };

  if (loggedUser?.isAdmin) {
    return (
      <Box position="fixed" left="50px" bottom="50px">
        <Heading fontSize="3xl" color="danger.def">
          Usuário Administrador
        </Heading>
      </Box>
    );
  }

  if (!isOpen) {
    return (
      <Box position="fixed" right="50px" bottom="50px">
        <Btn
          w="75px"
          h="75px"
          fontSize="30px"
          onClick={open}
          borderRadius="50%"
          shadow="dark-lg"
        >
          <ChatIcon />
        </Btn>
      </Box>
    );
  }

  return (
    <Box
      w="450px"
      h="600px"
      position="fixed"
      bottom="25px"
      right="25px"
      shadow="dark-lg"
    >
      <HStack
        w="100%"
        h="10%"
        bgColor="primary.def"
        justifyContent="space-between"
        paddingX="1rem"
      >
        <Text color="white">Suporte</Text>
        <Button
          onClick={close}
          bgColor="transparent"
          _hover={{ bgColor: 'primary.light' }}
        >
          <CloseIcon color="white" />
        </Button>
      </HStack>
      <Box
        w="100%"
        h="75%"
        bgColor={bgStyle}
        overflowY="auto"
        ref={chatMessagesBoxRef}
      >
        {!loggedUser ? (
          <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
            <Box>
              <Text>Entre para enviar uma mensagem</Text>
              <Btn
                onClick={signInHandler}
                marginTop="1rem"
                w="100%"
                buttonStyle="success"
              >
                Entrar
              </Btn>
            </Box>
          </Flex>
        ) : (
          <ChatBoxMessages messages={messages} />
        )}
      </Box>
      <ChatBoxInput sendMessageHandler={sendMessageHandler} />
    </Box>
  );
};

export { ChatBox };
