import React, { FC } from 'react';
import NextLink from 'next/link';
import {
  Box,
  VStack,
  Image,
  Heading,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Badge,
  Link,
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import { Btn } from './btn';

type Product = {
  name: string;
  priceFormatted: string;
  image: string;
  countInStock: number;
  slug: string;
};

const ProductCard: FC<{ product: Product }> = ({
  product: { name, priceFormatted, image, countInStock, slug },
}) => {
  return (
    <VStack
      overflow="hidden"
      bgColor={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      w="100%"
      h="auto"
      justifyContent="space-between"
    >
      <NextLink href={`/product/${slug}`} passHref>
        <Link
          _hover={{
            textDecor: 'none',
            bgColor: 'gray.300',
          }}
          _focus={{ outline: 0 }}
          flex="1"
        >
          <Image src={image} />
          <Box p="3">
            <Heading textAlign="center" fontWeight={600} size="sm">
              {name}
            </Heading>
          </Box>
        </Link>
      </NextLink>
      <HStack p="0 0 0.5rem 0.5rem" gridGap="4" justifyContent="center">
        <Text>{priceFormatted}</Text>
        {countInStock > 0 ? (
          <Btn buttonStyle="secondary">
            <Icon as={MdAdd} w={6} h={6} />
          </Btn>
        ) : (
          <Badge colorScheme="red">Sem estoque</Badge>
        )}
      </HStack>
    </VStack>
  );
};

export { ProductCard };
