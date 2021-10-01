import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const colors = {
  primary: {
    def: '#4a148c',
    light: '#7c43bd',
    dark: '#12005e',
  },
  secondary: {
    def: '#303f9f',
    light: '#666ad1',
    dark: '#001970',
  },
};

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const styles = {
  global: {
    '#__next': {
      height: '100%',
    },
    body: {
      height: '100vh',
      overflow: 'hidden',
    },
  },
};

const theme = extendTheme({ colors, config, styles });

export { theme };
