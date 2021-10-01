import React, { FC, useState } from 'react';
import { Icon } from '@chakra-ui/react';
import { MdAccountBox } from 'react-icons/md';
import { CircleButton } from '../ui/circle-button';
import { Drawer } from '../ui/drawer';

const AccountMenu: FC = () => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const closeAccountMenu = () => setIsAccountMenuOpen(false);

  const openAccountMenu = () => setIsAccountMenuOpen(true);

  return (
    <>
      <CircleButton onClick={openAccountMenu}>
        <Icon as={MdAccountBox} w={6} h={6} color="white" />
      </CircleButton>
      <Drawer
        close={closeAccountMenu}
        header="Conta"
        isOpen={isAccountMenuOpen}
        placement="left"
      >
        <div>Hello world</div>
      </Drawer>
    </>
  );
};

export { AccountMenu };
