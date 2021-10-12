import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Heading, Text } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { Btn } from './btn';

type DashCardProps = {
  value: string;
  title: string;
};

const DashCard: FC<DashCardProps> = ({ title, value }) => {
  const [hideValue, setHideValue] = useState(false);

  const toggleVisibility = () => setHideValue(!hideValue);

  return (
    <>
      <Heading fontWeight="medium" size="lg">
        {hideValue
          ? value
              .split('')
              .map(() => '*')
              .join('')
          : value}
      </Heading>
      <Text>
        {title}{' '}
        {hideValue ? (
          <ViewOffIcon ml="2" cursor="pointer" onClick={toggleVisibility} />
        ) : (
          <ViewIcon ml="2" cursor="pointer" onClick={toggleVisibility} />
        )}
      </Text>
      <Btn>VER {title.toUpperCase()}</Btn>
    </>
  );
};

export { DashCard };
