import { ArrowRightIcon } from '@chakra-ui/icons';
import { HStack, Input } from '@chakra-ui/react';
import React, { FC, useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Btn } from './btn';

type CheckBoxInputProps = {
  sendMessageHandler: (msg: string) => void;
};

const ChatBoxInput: FC<CheckBoxInputProps> = ({ sendMessageHandler }) => {
  const { loggedUser } = useAuth();
  const isDisabled = useMemo(() => (loggedUser ? false : true), [loggedUser]);
  const [message, setMessage] = useState('');

  return (
    <HStack
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessageHandler(message);
        setMessage('');
      }}
      justifyContent="space-between"
      paddingX="1rem"
      w="100%"
      h="15%"
      bgColor="secondary.def"
    >
      <Input
        bgColor="secondary.light"
        color="white"
        border="1px solid"
        borderColor="gray.500"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isDisabled}
      />
      <Btn type="submit" disabled={isDisabled} buttonStyle="success">
        <ArrowRightIcon />
      </Btn>
    </HStack>
  );
};

export { ChatBoxInput };
