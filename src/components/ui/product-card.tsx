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
import { useCart } from '../../hooks/useCart';
import { useMenu } from '../../hooks/useMenu';
import { StarsRating } from './stars-rating';

type Product = {
  _id: string;
  name: string;
  price: number;
  priceFormatted: string;
  image: string;
  countInStock: number;
  slug: string;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
};

const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const { addItem } = useCart();
  const { openCartMenu } = useMenu();

  return (
    <VStack
      gridGap="1"
      overflow="hidden"
      bgColor={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      w="100%"
      h="auto"
      justifyContent="space-between"
    >
      <NextLink href={`/product/${product.slug}`} passHref>
        <Link
          _hover={{
            textDecor: 'none',
            bgColor: 'gray.300',
          }}
          _focus={{ outline: 0 }}
          flex="1"
        >
          <Image src={product.image} />
          <Box p="3">
            <Heading textAlign="center" fontWeight={600} size="sm">
              {product.name}
            </Heading>
          </Box>
        </Link>
      </NextLink>
      <StarsRating rating={product.rating} numReviews={product.numReviews} />
      <HStack p="0 0 0.5rem 0.5rem" gridGap="4" justifyContent="center">
        <Text>{product.priceFormatted}</Text>
        {product.countInStock > 0 ? (
          <Btn
            buttonStyle="secondary"
            onClick={() => {
              addItem({ ...product, qty: 1 });
              openCartMenu();
            }}
          >
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
