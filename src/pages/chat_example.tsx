import { NextPage } from 'next';
import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { MainContainer } from '../components/ui/main-container';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { API_URL } from '../utils/constants';

type Message = {
  senderId: string;
  message: string;
  senderName: string;
  sendTime: string;
  sendTimeFormatted: string;
};

const ChatExample: NextPage = () => {
  const { loggedUser } = useAuth();
  const socket = useMemo<Socket>(() => io(`${API_URL}/room`), []);
  const messageInputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState('');

  const joinRoomHandler = () => {
    if (!loggedUser?._id) return;
    socket.emit(
      'enter-room',
      { userId: loggedUser._id },
      (body: { roomId: string; messages: Message[] }) => {
        console.log(body.messages);
        setRoomId(body.roomId);
        setMessages(
          body.messages.map((msg) => ({
            ...msg,
            sendTimeFormatted: format(new Date(msg.sendTime), 'dd/MM HH:mm', {
              locale: ptBR,
            }),
          })),
        );
      },
    );
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('abriu a conexao');
    });
  }, []);

  const sendMessage = () => {
    if (!loggedUser) return;
    const messageText = messageInputRef.current.value;
    const newMessage = {
      message: messageText,
      id: loggedUser._id,
      name: loggedUser.name,
      roomId,
    };
    socket?.emit(
      'send-message',
      newMessage,
      ({ newMessage }: { newMessage: Message }) => {
        messageInputRef.current.value = '';
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

  return (
    <MainContainer>
      <h1>Chat</h1>
      <button type="button" onClick={joinRoomHandler}>
        Entrar
      </button>
      <p>
        <label htmlFor="message">Mensagem: </label>
        <input
          type="text"
          id="message"
          ref={messageInputRef}
          style={{ color: 'black' }}
        />
        <button type="button" onClick={sendMessage}>
          Enviar
        </button>
      </p>
      <ul>
        {messages.map((msg) => (
          <li key={`${new Date(msg.sendTime).getTime()}`}>
            {msg.senderName} - {msg.message} : {msg.sendTimeFormatted}
          </li>
        ))}
      </ul>
    </MainContainer>
  );
};

export default ChatExample;
