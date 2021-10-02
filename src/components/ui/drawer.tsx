import React, { FC } from 'react';
import {
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerProps as ChakraDrawerProps,
  DrawerFooter,
} from '@chakra-ui/react';

type DrawerProps = ChakraDrawerProps & {
  isOpen: boolean;
  onClose: () => void;
  placement: 'top' | 'right' | 'bottom' | 'left';
  header: string;
  footer?: React.ReactNode;
};

const Drawer: FC<DrawerProps> = ({
  isOpen,
  onClose,
  placement,
  children,
  header,
  footer,
  ...rest
}) => {
  return (
    <>
      <ChakraDrawer
        isOpen={isOpen}
        placement={placement}
        onClose={onClose}
        {...rest}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton _focus={{ outline: 0 }} />
          <DrawerHeader>{header}</DrawerHeader>

          <DrawerBody>{children}</DrawerBody>

          {footer && <DrawerFooter>{footer}</DrawerFooter>}
        </DrawerContent>
      </ChakraDrawer>
    </>
  );
};

export { Drawer };
