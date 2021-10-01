import React, { useState } from 'react';
import { Icon } from '@chakra-ui/react';
import { MdAccountBox } from 'react-icons/md';
import { CircleButton } from '../ui/circle-button';
import { Drawer } from '../ui/drawer';

const CartMenu = () => {
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);

  const closeCartMenu = () => setIsCartMenuOpen(false);

  const openCartMenu = () => setIsCartMenuOpen(true);

  return (
    <>
      <CircleButton onClick={openCartMenu}>
        <Icon as={MdAccountBox} w={6} h={6} color="white" />
      </CircleButton>
      <Drawer
        close={closeCartMenu}
        header="Carrinho"
        isOpen={isCartMenuOpen}
        placement="right"
      >
        <div>Hello world</div>
      </Drawer>
    </>
  );
};

export { CartMenu };
