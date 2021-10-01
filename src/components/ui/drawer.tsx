import React, { FC } from 'react';
import {
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

type DrawerProps = {
  isOpen: boolean;
  close: () => void;
  placement: 'top' | 'right' | 'bottom' | 'left';
  header: string;
};

const Drawer: FC<DrawerProps> = ({
  isOpen,
  close,
  placement,
  children,
  header,
}) => {
  return (
    <>
      <ChakraDrawer isOpen={isOpen} placement={placement} onClose={close}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton _focus={{ outline: 0 }} />
          <DrawerHeader>{header}</DrawerHeader>

          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </ChakraDrawer>
    </>
  );
};

export { Drawer };
