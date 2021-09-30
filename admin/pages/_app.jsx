import Head from "next/head";
import Router from "next/router";

import { ChakraProvider } from "@chakra-ui/react";
import Custom404 from "./404";
import NProgress from "nprogress";

import Layout from "../layouts";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps }) => {
  const getLayout =
    Component.getLayout ||
    ((page) => {
      return <Layout>{page}</Layout>;
    });

  return (
    <>
      <Head>
        <link rel="stylesheet" type="text/css" href="/css/nprogress.css" />
      </Head>
      <ChakraProvider>
        {getLayout(
          pageProps.statusCode == 404 ? (
            <Custom404 />
          ) : (
            <Component {...pageProps} />
          )
        )}
      </ChakraProvider>
    </>
  );
};

export default App;
