import React, { FC } from 'react';
import { Text } from '@chakra-ui/react';

type PropertyTextProps = {
  title: string;
  text?: string;
};

const PropertyText: FC<PropertyTextProps> = ({ text, title }) => {
  return (
    <Text fontSize="xl" wordBreak="break-word">
      <Text as="span" fontWeight="medium">
        {title}:{' '}
      </Text>
      {text || ''}
    </Text>
  );
};

export { PropertyText };
