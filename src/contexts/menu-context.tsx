import React, { createContext, FC, useState } from 'react';

type MenuContextData = {
  isAccountMenuOpen: boolean;
  isCartMenuOpen: boolean;
  openCartMenu: () => void;
  closeCartMenu: () => void;
  openAccountMenu: () => void;
  closeAccountMenu: () => void;
};

const MenuContext = createContext({} as MenuContextData);

const MenuProvider: FC = ({ children }) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpenOpen] = useState(false);

  const openCartMenu = () => setIsCartMenuOpenOpen(true);
  const closeCartMenu = () => setIsCartMenuOpenOpen(false);
  const openAccountMenu = () => setIsAccountMenuOpen(true);
  const closeAccountMenu = () => setIsAccountMenuOpen(false);

  return (
    <MenuContext.Provider
      value={{
        closeAccountMenu,
        closeCartMenu,
        isAccountMenuOpen,
        isCartMenuOpen,
        openAccountMenu,
        openCartMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export { MenuContext, MenuProvider };
