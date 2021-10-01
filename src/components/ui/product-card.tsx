import React, { FC } from 'react';
import {
  Box,
  VStack,
  Image,
  Heading,
  HStack,
  Text,
  Button,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';

type Product = {
  name: string;
  priceFormatted: string;
  image: string;
  countInStock: number;
  slug: string;
  rating: number;
};

const ProductCard: FC<{ product: Product }> = ({
  product: { name, priceFormatted, image },
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
      <Image src={image} />
      <Box flex="1">
        <Box p="3">
          <Heading textAlign="center" fontWeight={600} size="sm">
            {name}
          </Heading>
        </Box>
        <HStack p="0 0 0.5rem 0.5rem" gridGap="4" justifyContent="center">
          <Text>{priceFormatted}</Text>
          <Button
            bgColor="secondary.def"
            color="white"
            _hover={{ bgColor: 'secondary.light' }}
            _focus={{ outline: 0 }}
            _active={{ transform: 'scale(0.9)' }}
          >
            <Icon as={MdAdd} w={6} h={6} />
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
};

export { ProductCard };
