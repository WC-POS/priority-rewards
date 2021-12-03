import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Spinner,
  Stack,
  Switch,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  Tabs,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { format, fromUnixTime } from 'date-fns';
import {
  UilAward,
  UilCheck,
  UilCloudCheck,
  UilCloudSlash,
  UilCloudTimes,
  UilCloudUpload,
  UilEye,
  UilEyeSlash,
  UilMoon,
  UilPen,
  UilServerConnection,
  UilSetting,
  UilSave,
  UilStar,
  UilSun,
  UilSync,
  UilTicket,
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

const DetailsModal = (props) => {
  const altBG = useColorModeValue('gray.100', 'gray.600');
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} scrollBehavior="inside">
      <ModalOverlay />
      {props.franchise && props.location ? (
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Stack direction="row" spacing={4}>
              <Box rounded="full" overflow="hidden" bg={altBG} p={2}>
                <Image
                  src={props.franchise.logo.location}
                  alt={props.franchise.logo.alternativeText}
                  objectFit="contain"
                  h={16}
                  w={16}
                />
              </Box>

              <Stack direction="column" spacing={0}>
                <Text size="md" fontWeight="light">{`${props.franchise.displayTitle.superTitle + ' '}${
                  props.franchise.displayTitle.title + ' '
                }${props.franchise.displayTitle.subtitle}`}</Text>
                <Heading size="lg">{props.location.name}</Heading>
              </Stack>
            </Stack>
          </ModalHeader>
          <ModalBody>
            <Tabs isFitted variant="solid-rounded">
              <TabList>
                <Tab>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {props.location.isActive ? <></> : <UilCloudTimes />}
                    <Text>Location</Text>
                  </Stack>
                </Tab>
                <Tab>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Text>Franchise</Text>
                  </Stack>
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel px={0} py={4}>
                  {props.location.services.promotions || props.location.services.events ? (
                    <Stack direction="row" w="full">
                      {props.location.services.promotions ? (
                        <Stack
                          direction="row"
                          w="full"
                          bg={altBG}
                          alignItems="center"
                          justifyContent="center"
                          spacing={2}
                          py={2}
                          rounded="md"
                        >
                          <UilAward />
                          <Text>Promotions</Text>
                        </Stack>
                      ) : (
                        <></>
                      )}
                      {props.location.services.events ? (
                        <Stack
                          direction="row"
                          w="full"
                          bg={altBG}
                          alignItems="center"
                          justifyContent="center"
                          spacing={2}
                          py={2}
                          rounded="md"
                        >
                          <UilTicket />
                          <Text>Events</Text>
                        </Stack>
                      ) : (
                        <></>
                      )}
                    </Stack>
                  ) : (
                    <></>
                  )}
                  <Stack
                    direction="column"
                    w="full"
                    bg={altBG}
                    alignItems="flex-start"
                    justifyContent="start"
                    spacing={0}
                    p={4}
                    rounded="md"
                    mt={2}
                  >
                    <Text fontWeight="semibold" fontSize="lg">
                      {props.location.address.street1}
                    </Text>
                    {props.location.address.street2 ? <Text>{props.location.address.street2}</Text> : <></>}
                    <Text>
                      {props.location.address.city + ', '}
                      {props.location.address.state + ' '}
                      {props.location.address.zipCode}
                    </Text>
                  </Stack>
                  <Stack
                    direction="row"
                    w="full"
                    bg={altBG}
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    py={2}
                    rounded="md"
                    mt={2}
                  >
                    <UilSave />
                    <Text>{format(fromUnixTime(props.location.updatedAt), 'MMM d, yyyy h:mma')}</Text>
                  </Stack>
                  <Stack
                    direction="row"
                    w="full"
                    bg={altBG}
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    py={2}
                    rounded="md"
                    mt={2}
                  >
                    <Text>{props.location._id}</Text>
                  </Stack>
                </TabPanel>
                {/* Franchise Panel */}
                <TabPanel px={0} py={4}>
                  {props.franchise.services.promotions || props.franchise.services.events ? (
                    <Stack direction="row" w="full">
                      {props.franchise.services.promotions ? (
                        <Stack
                          direction="row"
                          w="full"
                          bg={altBG}
                          alignItems="center"
                          justifyContent="center"
                          spacing={2}
                          py={2}
                          rounded="md"
                        >
                          <UilAward />
                          <Text>Promotions</Text>
                        </Stack>
                      ) : (
                        <></>
                      )}
                      {props.franchise.services.events ? (
                        <Stack
                          direction="row"
                          w="full"
                          bg={altBG}
                          alignItems="center"
                          justifyContent="center"
                          spacing={2}
                          py={2}
                          rounded="md"
                        >
                          <UilTicket />
                          <Text>Events</Text>
                        </Stack>
                      ) : (
                        <></>
                      )}
                    </Stack>
                  ) : (
                    <></>
                  )}

                  <Stack
                    direction="row"
                    w="full"
                    bg={altBG}
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    py={2}
                    rounded="md"
                    mt={2}
                  >
                    <Text>{props.franchise._id}</Text>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter w="full">
            <Stack w="full" direction="row" alignItems="center" justifyContent="space-between">
              <Button variant="ghost" onClick={props.onRefresh}>
                <UilSync />
              </Button>
              <Button onClick={props.onClose}>Dismiss</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      ) : (
        <></>
      )}
    </Modal>
  );
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
    setShowPassword(false);
    setShowPrivate(false);
  };

  const onSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    window.Main.setConfig(config);
    window.Main.once('setConfig', () => props.onSave());
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
  const altRow = useColorModeValue('gray.100', 'gray.600');
  const inputBG = useColorModeValue('white', 'gray.700');
  const { colorMode, toggleColorMode } = useColorMode();
  const [config, setConfig] = useState(configTemplate);
  const [franchise, setFranchise] = useState(null);
  const [isAPIConnected, setIsAPIConnected] = useState(false);
  const [isAPILoading, setIsAPILoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const [location, setLocation] = useState(null);
  const toast = useToast();

  const getData = async () => {
    setIsAPILoading(true);
    const res = await fetch(
      `https://${
        window.env.ELECTRON_PUBLIC_API_HOST ? window.env.ELECTRON_PUBLIC_API_HOST : window.env.DEFAULT_API_HOST
      }/sync/fpos/`,
      {
        method: 'GET',
        headers: {
          'sync-public': config.API.public,
          'sync-private': config.API.private
        }
      }
    );
    if (res.ok) {
      const data = await res.json();
      setFranchise(data.franchise);
      setLocation(data.location);
      setIsAPIConnected(true);
    } else {
      setFranchise(null);
      setLocation(null);
      setIsAPIConnected(false);
      toast({
        title: 'Cannot connect to PriorityRewards',
        description:
          'There was an error connecting to the PriorityRewards servers, please confirm that the Public and Private API Keys are correct.',
        status: 'error',
        duration: 10000,
        isClosable: true
      });
    }
    setIsAPILoading(false);
  };

  useEffect(() => {
    if (window.Main) {
      window.Main.on('error', (msg) => {
        toast({
          title: msg.title,
          description: msg.body,
          status: 'error',
          duration: 10000,
          isClosable: true
        });
      });
      window.Main.on('getConfig', (reply) => {
        setConfig(reply.config);
        setIsConnected(reply.status);
        setIsLoading(false);
      });
      window.Main.on('setConfig', (reply) => {
        setConfig(reply.config);
        setIsConnected(reply.status);
        setIsLoading(false);
      });
      window.Main.getConfig();
    }
  }, []);

  useEffect(() => {
    if (config.API.public && config.API.private) {
      getData();
    } else {
    }
  }, [config]);

  const refreshData = () => {
    onDetailsClose();
    getData();
  };

  const saveSettings = () => {
    onSettingsClose();
  };

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onOpen={onSettingsOpen}
        onClose={onSettingsClose}
        config={config}
        onSave={saveSettings}
      />

      <DetailsModal
        isOpen={isDetailsOpen}
        onOpen={onDetailsOpen}
        onClose={onDetailsClose}
        onRefresh={refreshData}
        franchise={franchise}
        location={location}
      />
      <Stack h="100vh" w="full" bg={bodyBG}>
        <Stack direction="column" h="full" w="full" alignItems="stretch" p={4}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Heading size="lg">PriorityRewards</Heading>
              <Badge colorScheme="purple">
                <Text textTransform="lowercase">v0.1.0</Text>
              </Badge>
            </Stack>
            <Stack direction="row" alignItems="center">
              <Button
                variant="solid"
                colorScheme={isConnected ? 'green' : 'red'}
                isLoading={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  window.Main.getConfig();
                }}
              >
                <UilServerConnection />
              </Button>
              <Button
                variant="solid"
                colorScheme={isAPIConnected ? 'green' : 'red'}
                isLoading={isAPILoading}
                onClick={() => (isAPIConnected ? onDetailsOpen() : getData())}
              >
                {isAPIConnected ? <UilCloudCheck /> : <UilCloudSlash />}
              </Button>
            </Stack>
          </Stack>
          <Stack bg={altBG} rounded="md" p={4} overflowY="auto" h="full">
            <Tabs variant="solid-rounded" isFitted h="full">
              <TabList>
                <Tab>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <UilStar />
                    <Text>Sections</Text>
                  </Stack>
                </Tab>
                <Tab>Departments</Tab>
                <Tab>Items</Tab>
                <Tab>Sales</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" px={4} py={2}>
                      <Stack direction="row" spacing={4} alignItems="center">
                        <Switch />
                        <Text>Departments</Text>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <NumberInput>
                          <NumberInputField w={24} bg={inputBG} />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <Select bg={inputBG}>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </Select>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                      bg={altRow}
                      rounded="md"
                      px={4}
                      py={2}
                    >
                      <Stack direction="row" spacing={4} alignItems="center">
                        <Switch rounded="md" />
                        <Text>Items</Text>
                        {/* <Spinner color="blue.500" speed="750ms" /> */}
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <NumberInput>
                          <NumberInputField w={24} bg={inputBG} />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <Select bg={inputBG}>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </Select>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" px={4} py={2}>
                      <Stack direction="row" spacing={4} alignItems="center">
                        <Switch />
                        <Text>Sales</Text>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <NumberInput>
                          <NumberInputField w={24} bg={inputBG} />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <Select bg={inputBG}>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </Select>
                      </Stack>
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
          <Stack direction="row" spacing={4} w="full" justifyContent="space-between" flexShrink={0}>
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
              <IconButton icon={<UilSetting />} onClick={onSettingsOpen} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default App;
