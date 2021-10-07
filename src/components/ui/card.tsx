import { useColorModeValue, VStack, StackProps } from '@chakra-ui/react';
import React, { FC } from 'react';

type CardProps = StackProps;

const Card: FC<CardProps> = ({
  p = '6',
  w = '100%',
  gridGap = '3',
  children,
  ...rest
}) => {
  const cardStyle = useColorModeValue('white', 'gray.700');

  return (
    <VStack
      bgColor={cardStyle}
      w={w}
      p={p}
      borderRadius="lg"
      gridGap={gridGap}
      m="0 auto"
      {...rest}
    >
      {children}
    </VStack>
  );
};

export { Card };
