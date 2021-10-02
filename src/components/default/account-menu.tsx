import React, { FC } from 'react';
import { Icon } from '@chakra-ui/react';
import { MdAccountBox } from 'react-icons/md';
import { CircleButton } from '../ui/circle-button';
import { Drawer } from '../ui/drawer';
import { useMenu } from '../../hooks/useMenu';

const AccountMenu: FC = () => {
  const { openAccountMenu, closeAccountMenu, isAccountMenuOpen } = useMenu();

  return (
    <>
      <CircleButton onClick={openAccountMenu}>
        <Icon as={MdAccountBox} w={6} h={6} color="white" />
      </CircleButton>
      <Drawer
        onClose={closeAccountMenu}
        header="Conta"
        isOpen={isAccountMenuOpen}
        placement="right"
      >
        <div>Hello world</div>
      </Drawer>
    </>
  );
};

export { AccountMenu };
