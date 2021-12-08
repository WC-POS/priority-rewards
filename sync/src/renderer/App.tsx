import {
  Badge,
  Box,
  Button,
  Heading,
  IconButton,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Link, Route, MemoryRouter as Router, Switch } from 'react-router-dom';
import {
  UilCloudUpload,
  UilMoon,
  UilParcel,
  UilPizzaSlice,
  UilReceipt,
  UilSetting,
  UilSun,
  UilTachometerFastAlt,
} from '@iconscout/react-unicons';

import CloudStatus from './components/CloudStatus';
import ConnectionStatus from './components/ConnectionStatus';
import ErrorToastManager from './components/ErrorToastManager';
import Home from './pages/Home';
import Items from './pages/Items';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const altBG = useColorModeValue('white', 'gray.700');
  const bodyBG = useColorModeValue('gray.100', 'gray.800');
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Router>
      <Box bg={bodyBG} h="100vh" overflowY="auto">
        <Box
          flexDirection="row"
          display="flex"
          justifyContent="space-between"
          p={2}
          position="fixed"
          top={0}
          w="full"
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            overscrollX="auto"
          >
            <Heading size="lg">PriorityRewards</Heading>
            <Badge colorScheme="purple">
              <Text textTransform="lowercase">v0.1.0</Text>
            </Badge>
          </Stack>
          <Stack direction="row" alignItems="center">
            <CloudStatus />
            <ConnectionStatus />
          </Stack>
        </Box>
        <Box h="100vh" p={2} pt={14} pb="104px">
          <Stack direction="row" spacing={4}>
            <Button
              as={Link}
              to="/"
              colorScheme="teal"
              leftIcon={<UilTachometerFastAlt />}
            >
              Dashboard
            </Button>
            <Button
              as={Link}
              to="/departments/"
              colorScheme="teal"
              leftIcon={<UilParcel />}
            >
              Departments
            </Button>
            <Button
              as={Link}
              to="/items/"
              colorScheme="teal"
              leftIcon={<UilPizzaSlice />}
            >
              Items
            </Button>
            <Button
              as={Link}
              to="/sales/"
              colorScheme="teal"
              leftIcon={<UilReceipt />}
            >
              Sales
            </Button>
          </Stack>
          <Stack
            mt={2}
            overflowY="scroll"
            h="full"
            bg={altBG}
            rounded="md"
            spacing={0}
          >
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/items">
                <Items />
              </Route>
            </Switch>
          </Stack>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          w="full"
          p={2}
          position="fixed"
          bottom={0}
        >
          <Button colorScheme="blue" leftIcon={<UilCloudUpload />}>
            Upload
          </Button>
          <Stack direction="row" spacing={4}>
            <IconButton
              aria-label="Color mode switcher"
              icon={colorMode === 'dark' ? <UilSun /> : <UilMoon />}
              onClick={toggleColorMode}
            />
            <IconButton
              aria-label="Settings modal"
              icon={<UilSetting />}
              onClick={onOpen}
            />
          </Stack>
        </Box>
        <ErrorToastManager />
        <SettingsModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </Router>
  );
}
