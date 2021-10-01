import React, { FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

type BtnProps = ButtonProps & {
  buttonStyle?: 'primary' | 'secondary';
};

const Btn: FC<BtnProps> = ({ children, buttonStyle = 'primary', ...rest }) => {
  return (
    <Button
      bgColor={`${buttonStyle}.def`}
      color="white"
      _hover={{ bgColor: `${buttonStyle}.light` }}
      _focus={{ outline: 0 }}
      _active={{ transform: 'scale(0.9)' }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export { Btn };
