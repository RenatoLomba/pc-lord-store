import { Heading, HeadingProps } from '@chakra-ui/react';
import React, { FC } from 'react';

type TitleProps = HeadingProps;

const Title: FC<TitleProps> = ({ children, ...rest }) => {
  return (
    <Heading size="lg" mb="6" fontWeight="thin" {...rest}>
      {children}
    </Heading>
  );
};

export { Title };
