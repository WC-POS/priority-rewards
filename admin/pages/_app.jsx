import { ChakraProvider } from "@chakra-ui/react";
import Custom404 from "./404";

const App = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      {pageProps.statusCode === 404 ? (
        <Custom404 />
      ) : (
        <Component {...pageProps} />
      )}
    </ChakraProvider>
  );
};

export default App;
