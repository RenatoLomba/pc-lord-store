import { useContext } from 'react';
import { MenuContext } from '../contexts/menu-context';

const useMenu = () => {
  return useContext(MenuContext);
};

export { useMenu };
