import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true
};
const theme = extendTheme({ config });

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
