import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  Tabs,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import {
  UilCloudUpload,
  UilEye,
  UilEyeSlash,
  UilMoon,
  UilPen,
  UilSetting,
  UilSave,
  UilSun,
  UilTimes
} from '@iconscout/react-unicons';

const configTemplate = {
  API: {
    public: '',
    private: ''
  },
  FPOS: {
    host: '',
    user: '',
    password: '',
    database: ''
  }
};

const SettingsModal = (props) => {
  const [config, setConfig] = useState(configTemplate);
  const [isAPIChanged, setIsAPIChanged] = useState(false);
  const [isFPOSChanged, setIsFPOSChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);

  useEffect(() => {
    if (!props.isOpen) {
      setIsLoading(false);
      reset();
    }
  }, [props.isOpen]);

  useEffect(() => {
    reset();
    setIsLoading(false);
  }, [props.config]);

  const reset = () => {
    setConfig(props.config);
    setIsAPIChanged(false);
    setIsFPOSChanged(false);
  };

  const onSave = (e) => {
    e.preventDefault();
    window.Main.setConfig(config);
    props.onSave();
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} scrollBehavior="inside">
        <ModalOverlay />

        <ModalContent as="form" onSubmit={onSave}>
          <ModalCloseButton />
          <ModalHeader>Settings</ModalHeader>
          <ModalBody>
            <Tabs isFitted variant="solid-rounded">
              <TabList>
                <Tab>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Text>API</Text>
                    {isAPIChanged && <UilPen size={16} />}
                  </Stack>
                </Tab>
                <Tab>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Text>FPOS</Text>
                    {isFPOSChanged && <UilPen size={16} />}
                  </Stack>
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel px={0} py={4}>
                  <Stack spacing={4}>
                    <FormControl>
                      <FormLabel>Public Key</FormLabel>
                      <Input
                        variant="filled"
                        onChange={(e) => {
                          setIsAPIChanged(true);
                          setConfig({ ...config, API: { ...config.API, public: e.target.value } });
                        }}
                        value={config.API.public}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Private Key</FormLabel>
                      <Stack direction="row" spacing={2}>
                        <Input
                          variant="filled"
                          type={showPrivate ? 'text' : 'password'}
                          onChange={(e) => {
                            setIsAPIChanged(true);
                            setConfig({ ...config, API: { ...config.API, private: e.target.value } });
                          }}
                          value={config.API.private}
                        />
                        <IconButton
                          icon={showPrivate ? <UilEyeSlash /> : <UilEye />}
                          onClick={() => setShowPrivate(!showPrivate)}
                        />
                      </Stack>
                    </FormControl>
                  </Stack>
                </TabPanel>
                <TabPanel px={0} py={4}>
                  <Stack spacing={4}>
                    <FormControl>
                      <FormLabel>Host</FormLabel>
                      <Input
                        variant="filled"
                        onChange={(e) => {
                          setIsFPOSChanged(true);
                          setConfig({ ...config, FPOS: { ...config.FPOS, host: e.target.value } });
                        }}
                        value={config.FPOS.host}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>User</FormLabel>
                      <Input
                        variant="filled"
                        onChange={(e) => {
                          setIsFPOSChanged(true);
                          setConfig({ ...config, FPOS: { ...config.FPOS, user: e.target.value } });
                        }}
                        value={config.FPOS.user}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Password</FormLabel>
                      <Stack direction="row" spacing={2}>
                        <Input
                          variant="filled"
                          type={showPassword ? 'text' : 'password'}
                          onChange={(e) => {
                            setIsFPOSChanged(true);
                            setConfig({ ...config, FPOS: { ...config.FPOS, password: e.target.value } });
                          }}
                          value={config.FPOS.password}
                        />
                        <IconButton
                          icon={showPassword ? <UilEyeSlash /> : <UilEye />}
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </Stack>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Database</FormLabel>
                      <Input
                        variant="filled"
                        onChange={(e) => {
                          setIsFPOSChanged(true);
                          setConfig({ ...config, FPOS: { ...config.FPOS, database: e.target.value } });
                        }}
                        value={config.FPOS.database}
                      />
                    </FormControl>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row" spacing={4} w="full">
              <Button variant="ghost" leftIcon={<UilTimes />} onClick={props.onClose}>
                Close
              </Button>
              <Button
                variant="ghost"
                leftIcon={<UilSave />}
                w="full"
                colorScheme="blue"
                variant="solid"
                type="submit"
                isLoading={isLoading}
              >
                Save
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

function App() {
  const altBG = useColorModeValue('white', 'gray.700');
  const bodyBG = useColorModeValue('gray.100', 'gray.800');
  const { colorMode, toggleColorMode } = useColorMode();
  const [config, setConfig] = useState(configTemplate);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (window.Main) {
      console.log(window.Main);
      window.Main.on('getConfig', (config) => {
        setConfig(config);
        setIsLoading(false);
      });
      window.Main.on('setConfig', (config) => {
        setConfig(config);
        setIsLoading(false);
      });
      window.Main.getConfig();
    }
  }, []);

  const saveSettings = () => {
    onClose();
  };

  return (
    <>
      <SettingsModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} config={config} onSave={saveSettings} />
      <Stack h="100vh" w="full" bg={bodyBG} p={4}>
        <Stack direction="column" h="full" w="full">
          <Stack direction="row" spacing={2} alignItems="center">
            <Heading size="lg">PriorityRewards</Heading>
            <Badge colorScheme="purple">
              <Text textTransform="lowercase">v0.1.0</Text>
            </Badge>
          </Stack>
          <Stack h="full" bg={altBG} rounded="md" p={4}>
            <Tabs isFitted h="full">
              <TabList>
                <Tab>DB Tables</Tab>
                <Tab>Departments</Tab>
                <Tab>Items</Tab>
                <Tab>Sales</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Stack spacing={2}>
                    <Checkbox size="lg" rounded="lg">
                      All Tables
                    </Checkbox>
                    <Stack pl={6}>
                      <Checkbox size="lg" rounded="lg">
                        Departments
                      </Checkbox>
                      <Checkbox size="lg" rounded="lg">
                        Items
                      </Checkbox>
                      <Checkbox size="lg" rounded="lg">
                        Sales
                      </Checkbox>
                    </Stack>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={4} w="full" justifyContent="space-between">
          <Button
            colorScheme="blue"
            leftIcon={<UilCloudUpload />}
            isLoading={isLoading}
            onClick={() => window.Main.getConfig()}
          >
            Upload
          </Button>
          <Stack direction="row" spacing={4}>
            <IconButton icon={colorMode === 'dark' ? <UilSun /> : <UilMoon />} onClick={toggleColorMode} />
            <IconButton icon={<UilSetting />} onClick={onOpen} />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default App;
