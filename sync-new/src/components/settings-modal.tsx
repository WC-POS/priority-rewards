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
import React, { useEffect, useState } from "react";

import AppForm from "./app-form";
import CloudForm from "./cloud-form";
import { Config } from "../types";
import EmailForm from "./email-form";
import FposForm from "./fpos-form";
import { UilSetting } from "@iconscout/react-unicons";

const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  config: Config;
}> = ({ config, isOpen, onClose }) => {
  const [configDraft, setConfigDraft] = useState({ ...config });

  useEffect(() => {
    if (isOpen) {
      setConfigDraft({ ...config });
    }
  }, [isOpen, setConfigDraft]);

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
                  data={configDraft.fpos}
                  onChange={(val) =>
                    setConfigDraft({ ...configDraft, fpos: val })
                  }
                />
              </TabPanel>
              <TabPanel>
                <AppForm
                  data={configDraft.app}
                  onChange={(val) =>
                    setConfigDraft({ ...configDraft, app: val })
                  }
                />
              </TabPanel>
              <TabPanel>
                <CloudForm
                  data={configDraft.cloud}
                  onChange={(val) =>
                    setConfigDraft({ ...configDraft, cloud: val })
                  }
                />
              </TabPanel>
              <TabPanel>
                <EmailForm
                  data={configDraft.email}
                  onChange={(val) =>
                    setConfigDraft({ ...configDraft, email: val })
                  }
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
