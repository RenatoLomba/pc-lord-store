import React, { FC } from 'react';
import { Grid, Box } from '@chakra-ui/react';

const MainContainer: FC = ({ children }) => {
  return (
    <Grid
      mt={{ base: '7rem', lg: '5rem' }}
      overflowY="auto"
      paddingX={{ base: '3', lg: 'none' }}
      as="main"
      h="100%"
      templateColumns={{ base: '1fr', lg: '200px 1fr 200px' }}
      templateRows="50px 1fr 50px"
      templateAreas={{
        base: `
      '.'
      'main'
      '.'
      `,
        lg: `
      '. . .'
      '. main .'
      '. . .'
      `,
      }}
    >
      <Box gridArea="main">{children}</Box>
    </Grid>
  );
};

export { MainContainer };
