import React, { FC } from 'react';
import NextLink from 'next/link';
import { Link, useColorModeValue, VStack } from '@chakra-ui/react';

type SideBarProps = {
  tabs: { href: string; name: string; isActive: boolean }[];
};

const Sidebar: FC<SideBarProps> = ({ tabs }) => {
  const bgActiveStyle = useColorModeValue('gray.200', 'gray.500');

  const bgHoverStyle = useColorModeValue('gray.100', 'gray.600');

  return (
    <VStack
      w="100%"
      paddingY="3"
      bgColor={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
    >
      {tabs?.map((tab) => (
        <NextLink key={tab.name} href={tab.href} passHref>
          <Link
            _hover={{
              textDecoration: 'none',
              bgColor: !tab.isActive ? bgHoverStyle : '',
            }}
            fontSize="xl"
            w="100%"
            p="4"
            bgColor={tab.isActive ? bgActiveStyle : ''}
            cursor="pointer"
          >
            {tab.name}
          </Link>
        </NextLink>
      ))}
    </VStack>
  );
};

export { Sidebar };
