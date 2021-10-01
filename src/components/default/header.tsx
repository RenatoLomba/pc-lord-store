import React, { FC } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Link, HStack } from '@chakra-ui/react';
import { DarkModeToggler } from './dark-mode-toggler';
import { AccountMenu } from './account-menu';
import { CartMenu } from './cart-menu';

const Header: FC = () => {
  return (
    <>
      <Box
        as="header"
        h="5rem"
        w="100%"
        bgColor="primary.dark"
        color="white"
        position="fixed"
        top="0"
        left="0"
      >
        <Flex
          as="nav"
          w="100%"
          h="100%"
          justifyContent="space-between"
          alignItems="center"
          paddingX="4"
        >
          <NextLink href="/" passHref>
            <Link fontSize="2xl" _focus={{ outline: 0 }}>
              PC Lord Store
            </Link>
          </NextLink>

          <HStack gridGap="4" position="relative">
            <DarkModeToggler />
            <CartMenu />
            <AccountMenu />
          </HStack>
        </Flex>
      </Box>
    </>
  );
};

export { Header };
