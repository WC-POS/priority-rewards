import * as React from "react";
import * as ReactDOM from "react-dom";

import { ChakraProvider } from "@chakra-ui/react";
import Home from "./home";

function render() {
  ReactDOM.render(
    <ChakraProvider>
      <Home />
    </ChakraProvider>,
    document.querySelector("#app")
  );
}

render();
