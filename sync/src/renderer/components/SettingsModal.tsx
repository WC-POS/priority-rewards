import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  UilEye,
  UilEyeSlash,
  UilSave,
  UilTimes,
} from '@iconscout/react-unicons';

import { SettingsConfig } from 'types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<SettingsConfig>({
    API: {
      publicKey: '',
      privateKey: '',
    },
    FPOS: {
      host: '',
      user: '',
      password: '',
      database: '',
    },
    LOG: {
      database: '',
    },
    encrypted: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      window.electron.ipcRenderer
        .getConfig()
        .then((savedConfig) => {
          setConfig(savedConfig);
          setIsLoading(false);
          return null;
        })
        .catch((err) => err);
    }
  }, [isOpen]);

  const onSave = () => {
    setIsLoading(true);
    window.electron.ipcRenderer
      .setConfig(config)
      .then(() => {
        setIsLoading(false);
        onClose();
        return null;
      })
      .catch((err) => err);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent as="form">
        <ModalCloseButton />
        <ModalHeader>
          <Stack direction="row" spacing={4} alignItems="center">
            <Heading>Settings</Heading>
            {isLoading && <Spinner color="blue.500" />}
          </Stack>
        </ModalHeader>
        <ModalBody>
          <Tabs isFitted>
            <TabList>
              <Tab>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Text>API</Text>
                </Stack>
              </Tab>
              <Tab>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Text>FPOS</Text>
                </Stack>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0} py={4}>
                <Stack spacing={4}>
                  <FormControl isDisabled={isLoading}>
                    <FormLabel>Public Key</FormLabel>
                    <Input
                      variant="filled"
                      value={config.API.publicKey}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          API: { ...config.API, publicKey: e.target.value },
                        })
                      }
                    />
                  </FormControl>
                  <FormControl isDisabled={isLoading}>
                    <FormLabel>Private Key</FormLabel>
                    <Stack direction="row" spacing={2}>
                      <Input
                        variant="filled"
                        value={config.API.privateKey}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            API: { ...config.API, privateKey: e.target.value },
                          })
                        }
                        type={showPrivateKey ? 'text' : 'password'}
                      />
                      <IconButton
                        icon={showPrivateKey ? <UilEyeSlash /> : <UilEye />}
                        aria-label="Toggle show private key"
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                      />
                    </Stack>
                  </FormControl>
                </Stack>
              </TabPanel>
              <TabPanel px={0} py={4}>
                <Stack spacing={4}>
                  <FormControl isDisabled={isLoading}>
                    <FormLabel>Host</FormLabel>
                    <Input
                      variant="filled"
                      value={config.FPOS.host}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          FPOS: {
                            ...config.FPOS,
                            host: e.target.value,
                          },
                        })
                      }
                    />
                  </FormControl>
                  <FormControl isDisabled={isLoading}>
                    <FormLabel>User</FormLabel>
                    <Input
                      variant="filled"
                      value={config.FPOS.user}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          FPOS: {
                            ...config.FPOS,
                            user: e.target.value,
                          },
                        })
                      }
                    />
                  </FormControl>
                  <FormControl isDisabled={isLoading}>
                    <FormLabel>Password</FormLabel>
                    <Stack direction="row">
                      <Input
                        variant="filled"
                        value={config.FPOS.password}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            FPOS: {
                              ...config.FPOS,
                              password: e.target.value,
                            },
                          })
                        }
                        type={showPassword ? 'text' : 'password'}
                      />
                      <IconButton
                        icon={showPassword ? <UilEyeSlash /> : <UilEye />}
                        aria-label="Toggle show sql password"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </Stack>
                  </FormControl>
                  <FormControl isDisabled={isLoading}>
                    <FormLabel>Database</FormLabel>
                    <Input
                      variant="filled"
                      value={config.FPOS.database}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          FPOS: {
                            ...config.FPOS,
                            database: e.target.value,
                          },
                        })
                      }
                    />
                  </FormControl>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row" spacing={4} w="full">
            <Button variant="ghost" leftIcon={<UilTimes />} onClick={onClose}>
              Close
            </Button>
            <Button
              variant="solid"
              leftIcon={<UilSave />}
              w="full"
              colorScheme="blue"
              type="submit"
              onClick={onSave}
              isLoading={isLoading}
            >
              Save
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
