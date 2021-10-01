import React from 'react';
import { Switch, useColorMode } from '@chakra-ui/react';

const DarkModeToggler = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Switch
      position={{ base: 'fixed', lg: 'unset' }}
      bottom={{ base: '20px', lg: 'unset' }}
      isChecked={colorMode === 'dark'}
      onChange={toggleColorMode}
      size="lg"
      colorScheme="darkpurple"
    />
  );
};

export { DarkModeToggler };
