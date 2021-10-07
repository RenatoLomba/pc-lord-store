import React, { FC } from 'react';
import NextLink from 'next/link';
import { Heading, Icon, VStack, Link } from '@chakra-ui/react';
import { MdAccountBox } from 'react-icons/md';
import { CircleButton } from '../ui/circle-button';
import { Drawer } from '../ui/drawer';
import { useMenu } from '../../hooks/useMenu';
import { useAuth } from '../../hooks/useAuth';
import { Btn } from '../ui/btn';
import { useCart } from '../../hooks/useCart';
import { useRouter } from 'next/dist/client/router';
import { useOrder } from '../../hooks/useOrder';

const AccountMenu: FC = () => {
  const router = useRouter();
  const { loggedUser, logoutUser } = useAuth();
  const { clearCart } = useCart();
  const { clearOrder } = useOrder();
  const { openAccountMenu, closeAccountMenu, isAccountMenuOpen } = useMenu();

  const returnItemButton = () => {
    if (loggedUser) {
      const [firstName, lastName] = loggedUser.name.split(' ');
      const firstInitial = firstName?.substr(0, 1);
      const lastInitial = lastName?.substr(0, 1) || '';
      const initials = String(firstInitial + lastInitial).toUpperCase();
      return <Heading size="md">{initials}</Heading>;
    } else {
      return <Icon as={MdAccountBox} w={6} h={6} color="white" />;
    }
  };

  const logoutButtonHandler = () => {
    logoutUser();
    clearCart();
    clearOrder();
    closeAccountMenu();
    router.push('/login');
  };

  const loginButtonHandler = () => {
    closeAccountMenu();
    router.push('/login');
  };

  return (
    <>
      <CircleButton onClick={openAccountMenu}>
        {returnItemButton()}
      </CircleButton>
      <Drawer
        onClose={closeAccountMenu}
        header={loggedUser?.name || 'Conta'}
        isOpen={isAccountMenuOpen}
        placement="right"
      >
        <VStack gridGap="4" mt="6">
          {loggedUser ? (
            <>
              <NextLink href="/" passHref>
                <Link>Perfil</Link>
              </NextLink>
              <NextLink href="/" passHref>
                <Link>Histórico de compras</Link>
              </NextLink>

              <Btn w="100%" onClick={logoutButtonHandler} buttonStyle="danger">
                Fazer Logout
              </Btn>
            </>
          ) : (
            <Btn w="100%" onClick={loginButtonHandler} buttonStyle="success">
              Fazer Login
            </Btn>
          )}
        </VStack>
      </Drawer>
    </>
  );
};

export { AccountMenu };
