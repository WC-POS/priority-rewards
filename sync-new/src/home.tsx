import { Stack, useDisclosure } from "@chakra-ui/react";

import Body from "./components/body";
import Footer from "./components/footer";
import Header from "./components/header";
import React from "react";
import SettingsModal from "./components/settings-modal";

const Home: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Stack
      direction="column"
      bg="gray.100"
      h="100vh"
      p={4}
      spacing={4}
      maxH="100vh"
      w="100vw"
    >
      <SettingsModal isOpen={isOpen} onClose={onClose} />
      <Header />
      <Body />
      <Footer onSettingsClick={() => onOpen()} />
    </Stack>
  );
};

export default Home;
