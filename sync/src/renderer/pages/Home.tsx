import {
  Badge,
  Button,
  Heading,
  IconButton,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  UilCloudUpload,
  UilMoon,
  UilSetting,
  UilSun,
} from '@iconscout/react-unicons';

import CloudStatus from '../components/CloudStatus';
import ConnectionStatus from '../components/ConnectionStatus';
import ErrorToastManager from 'renderer/components/ErrorToastManager';
import React from 'react';
import SettingsModal from 'renderer/components/SettingsModal';

const Home: React.FC = () => {
  const altBG = useColorModeValue('white', 'gray.700');
  const bodyBG = useColorModeValue('gray.100', 'gray.800');
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Stack h="100vh" w="full" bg={bodyBG}>
        <Stack direction="column" h="full" w="full" alignItems="stretch" p={4}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Heading size="lg">PriorityRewards</Heading>
              <Badge colorScheme="purple">
                <Text textTransform="lowercase">v0.1.0</Text>
              </Badge>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <CloudStatus />
              <ConnectionStatus />
            </Stack>
          </Stack>
          <Stack bg={altBG} rounded="md" p={4} overflowY="auto" h="full">
            <Text>Hello world</Text>
          </Stack>
          <Stack
            direction="row"
            spacing={4}
            w="full"
            justifyContent="space-between"
            flexShrink={0}
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
          </Stack>
        </Stack>
      </Stack>
      <ErrorToastManager />
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Home;
