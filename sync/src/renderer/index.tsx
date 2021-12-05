import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import App from './App';
import { render } from 'react-dom';

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};
const theme = extendTheme({ config });

render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  document.getElementById('root')
);
