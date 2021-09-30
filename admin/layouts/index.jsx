import { Stack } from "@chakra-ui/react";

import Navbar from "../components/navbar";

const Layout = ({ children }) => {
  return (
    <Stack
      direction="column"
      w="100vw"
      h="100vh"
      p={4}
      spacing={4}
      bg="gray.100"
      alignItems="start"
      justifyContent="start"
    >
      <Navbar />
      <main>{children}</main>
    </Stack>
  );
};

export default Layout;
