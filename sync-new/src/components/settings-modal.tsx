import {
  Button,
  Heading,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import AppForm from "./app-form";
import CloudForm from "./cloud-form";
import EmailForm from "./email-form";
import FposForm from "./fpos-form";
import React from "react";
import { UilSetting } from "@iconscout/react-unicons";

const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" alignItems="center">
            <UilSetting />
            <Heading ml={2} size="md">
              Settings
            </Heading>
          </ModalHeader>
          <Tabs isFitted variant="unstyled" px={4}>
            <TabList>
              <Tab
                _selected={{
                  bg: "blue.100",
                  color: "blue.600",
                  fontWeight: "semibold",
                  rounded: "lg",
                }}
                mx={2}
              >
                FPOS
              </Tab>
              <Tab
                _selected={{
                  bg: "blue.100",
                  color: "blue.600",
                  fontWeight: "semibold",
                  rounded: "lg",
                }}
                mx={2}
              >
                App
              </Tab>
              <Tab
                _selected={{
                  bg: "blue.100",
                  color: "blue.600",
                  fontWeight: "semibold",
                  rounded: "lg",
                }}
                mx={2}
              >
                Cloud
              </Tab>
              <Tab
                _selected={{
                  bg: "blue.100",
                  color: "blue.600",
                  fontWeight: "semibold",
                  rounded: "lg",
                }}
                mx={2}
              >
                Email
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <FposForm
                  data={{
                    host: "localhost\\CESSQL",
                    user: "sa",
                    password: "Password#1234",
                    db: "testing",
                  }}
                />
              </TabPanel>
              <TabPanel>
                <AppForm
                  data={{
                    logOutput: "C:\\",
                    quickSyncFrequency: 5,
                    fullSyncTime: "04:00",
                  }}
                />
              </TabPanel>
              <TabPanel>
                <CloudForm
                  data={{ publicKey: "1234567890", privateKey: "1234567890" }}
                />
              </TabPanel>
              <TabPanel>
                <EmailForm
                  data={{
                    host: "www.gmail.com",
                    user: "testing@gmail.com",
                    password: "Password#1234",
                    port: 465,
                    useSSL: false,
                  }}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <ModalFooter>
            <Button mr={4} onClick={onClose} variant="ghost">
              Close
            </Button>
            <Button colorScheme="blue" w="full">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SettingsModal;
