import { Spinner, SpinnerProps, useColorModeValue } from '@chakra-ui/react';
import React, { FC } from 'react';

type LoadingProps = SpinnerProps & {
  loadingType?: 'primary' | 'secondary';
};

const Loading: FC<LoadingProps> = ({
  loadingType = 'primary',
  size = 'xl',
}) => {
  const mode = useColorModeValue('def', 'light');
  return <Spinner color={`${loadingType}.${mode}`} size={size} />;
};

export { Loading };
