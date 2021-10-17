import { ChatIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import React, {
  FC,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from '../../hooks/useAuth';
import { Btn } from '../ui/btn';
import { ChatBoxInput } from './chat-box-input';
import { ChatBoxMessages } from './chat-box-messages';

type Message = {
  senderId: string;
  message: string;
  senderName: string;
  sendTime: string;
  sendTimeFormatted: string;
};

type ChatBoxProps = {
  socket?: Socket;
  onConnect?: (
    setMessages: (messages: Message[]) => void,
    setRoomId: (id: string) => void,
  ) => void;
  roomId?: string;
};

const ChatBox: FC<ChatBoxProps> = ({
  socket,
  onConnect,
  roomId: roomIdProp,
}) => {
  const { loggedUser } = useAuth();

  const [roomId, setRoomId] = useState(roomIdProp || '');
  const [messages, setMessages] = useState<Message[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const bgStyle = useColorModeValue('gray.100', 'gray.800');

  const chatMessagesBoxRef = useRef() as MutableRefObject<HTMLDivElement>;

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!chatMessagesBoxRef?.current) return;
    const scrollHeight = chatMessagesBoxRef.current.scrollHeight;
    chatMessagesBoxRef.current.scrollTop = scrollHeight;
  }, [messages]);

  useEffect(() => {
    socket?.on('connect', () => {
      onConnect?.(setMessages, setRoomId);
    });
  }, [socket]);

  const sendMessageHandler = (message: string) => {
    socket?.emit(
      'send-message',
      { message, id: loggedUser?._id, name: loggedUser?.name, roomId },
      ({ newMessage }: { newMessage: Message }) => {
        setMessages((prev) => [
          ...prev,
          {
            ...newMessage,
            sendTimeFormatted: format(
              new Date(newMessage.sendTime),
              'dd/MM HH:mm',
              {
                locale: ptBR,
              },
            ),
          },
        ]);
      },
    );
  };

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
              <Btn marginTop="1rem" w="100%" buttonStyle="success">
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
