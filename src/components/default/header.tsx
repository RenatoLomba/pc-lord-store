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
        h={{ base: '7rem', lg: '5rem' }}
        w="100%"
        bgColor="primary.dark"
        color="white"
        position="fixed"
        top="0"
        left="0"
        boxShadow="0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)"
        zIndex={999}
      >
        <Flex
          as="nav"
          w="100%"
          h="100%"
          flexDir={{ base: 'column', lg: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          paddingX="4"
          paddingY={{ base: '2', lg: '0' }}
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
