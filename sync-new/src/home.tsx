import React, { useEffect, useState } from "react";
import { Stack, useDisclosure } from "@chakra-ui/react";

import Body from "./components/body";
import { DefaultConfig } from "./types";
import Footer from "./components/footer";
import Header from "./components/header";
import SettingsModal from "./components/settings-modal";

const Home: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [config, setConfig] = useState({ ...DefaultConfig });

  useEffect(() => {
    window.electron.ipcRenderer.getConfig().then((configObj) => {
      setConfig(configObj);
    });
  }, []);

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
      <SettingsModal isOpen={isOpen} onClose={onClose} config={config} />
      <Header />
      <Body />
      <Footer onSettingsClick={() => onOpen()} />
    </Stack>
  );
};

export default Home;
