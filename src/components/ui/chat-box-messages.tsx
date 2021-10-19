import { Box, HStack, VStack, Text, StackProps } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useAuth } from '../../hooks/useAuth';

type Message = {
  senderId: string;
  message: string;
  senderName: string;
  sendTime: string;
  sendTimeFormatted: string;
};

type ChatBoxMessagesProps = StackProps & {
  messages: Message[];
};

const ChatBoxMessages: FC<ChatBoxMessagesProps> = ({ messages, ...rest }) => {
  const { loggedUser } = useAuth();

  return (
    <VStack padding="3" {...rest}>
      {messages.map((message) => (
        <Box
          bgColor={
            message.senderId === loggedUser?._id
              ? 'rgba(0, 174, 255, 0.2)'
              : 'rgba(255, 251, 0, 0.2)'
          }
          padding="3"
          borderRadius="5px"
          w="47.5%"
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
