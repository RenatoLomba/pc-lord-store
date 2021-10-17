import { Box, HStack, VStack, Text } from '@chakra-ui/layout';
import React, { FC } from 'react';
import { useAuth } from '../../hooks/useAuth';

type Message = {
  senderId: string;
  message: string;
  senderName: string;
  sendTime: string;
  sendTimeFormatted: string;
};

type ChatBoxMessagesProps = {
  messages: Message[];
};

const ChatBoxMessages: FC<ChatBoxMessagesProps> = ({ messages }) => {
  const { loggedUser } = useAuth();

  return (
    <VStack gridGap="1" padding="3">
      {messages.map((message) => (
        <Box
          bgColor={
            message.senderId === loggedUser?._id
              ? 'rgba(0, 174, 255, 0.2)'
              : 'rgba(255, 251, 0, 0.2)'
          }
          padding="3"
          borderRadius="5px"
          w="50%"
          alignSelf={
            message.senderId === loggedUser?._id ? 'flex-end' : 'flex-start'
          }
          key={new Date(message.sendTime).getTime()}
        >
          <HStack w="100%" mb="1">
            <Text fontSize="sm" fontWeight="semibold">
              {message.senderName}
            </Text>
            <Text fontSize="sm" fontStyle="italic">
              {message.sendTimeFormatted}
            </Text>
          </HStack>
          <Text fontSize="md">{message.message}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export { ChatBoxMessages };
