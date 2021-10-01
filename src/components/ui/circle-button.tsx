import React, { FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

const CircleButton: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      borderRadius="50%"
      bgColor="primary.def"
      w="3rem"
      h="3rem"
      _hover={{ bgColor: 'primary.light' }}
      _active={{
        bgColor: 'primary.light',
        transform: 'scale(0.9)',
      }}
      _focus={{ outline: 0 }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export { CircleButton };
