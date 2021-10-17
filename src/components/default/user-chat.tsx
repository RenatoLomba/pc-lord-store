import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import React, { useMemo } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../../hooks/useAuth';
import { API_URL } from '../../utils/constants';
import { ChatBox } from './chat-box';

type Message = {
  senderId: string;
  message: string;
  senderName: string;
  sendTime: string;
  sendTimeFormatted: string;
};

const UserChat = () => {
  const { loggedUser } = useAuth();

  const socket = useMemo<Socket | undefined>(
    () => loggedUser && io(`${API_URL}/room`),
    [loggedUser],
  );

  const onConnect = (
    setMessages: (messages: Message[]) => void,
    setRoomId: (id: string) => void,
  ) => {
    socket?.emit(
      'enter-room',
      { userId: loggedUser?._id },
      (res: { roomId: string; messages: Message[] }) => {
        setRoomId(res.roomId);
        setMessages(
          res.messages.map((msg) => ({
            ...msg,
            sendTimeFormatted: format(new Date(msg.sendTime), 'dd/MM HH:mm', {
              locale: ptBR,
            }),
          })),
        );
      },
    );
  };

  return <ChatBox socket={socket} onConnect={onConnect} />;
};

export { UserChat };
