import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';

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
  global: (props: StyleFunctionProps) => ({
    '#__next': {
      height: '100%',
    },
    body: {
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',

      bg: mode('gray.100', 'gray.800')(props),
    },
    '::-webkit-scrollbar': {
      width: '10px',
    },
    '::-webkit-scrollbar-track': {
      bgColor: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      background: 'secondary.light',
      borderRadius: '10px',
    },
  }),
};

const theme = extendTheme({
  colors,
  config,
  styles,
});

export { theme };
