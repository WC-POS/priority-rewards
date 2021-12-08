import {
  Box,
  Button,
  Heading,
  Image,
  Link,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Franchise, Location } from 'types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  UilAward,
  UilCloudCheck,
  UilCloudSlash,
  UilExternalLinkAlt,
  UilShoppingBag,
  UilTicket,
} from '@iconscout/react-unicons';
import { useAPIStore, useFranchiseStore } from 'renderer/store';

import { useEnvMode } from 'renderer/hooks';

const CloudStatus: React.FC = () => {
  const altBg = useColorModeValue('gray.200', 'gray.600');
  const initRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { publicKey, privateKey, setKeys } = useAPIStore((state) => state);
  const { franchise, location, setFranchise, setLocation, reset } =
    useFranchiseStore((state) => ({
      franchise: state.franchise,
      location: state.location,
      setFranchise: state.setFranchise,
      setLocation: state.setLocation,
      reset: state.reset,
    }));
  const [status, setStatus] = useState(false);
  const { url } = useEnvMode();

  const getCloudData = useCallback(async () => {
    try {
      const res = await fetch(`${url}/sync/fpos/`, {
        method: 'GET',
        headers: {
          'sync-public': publicKey,
          'sync-private': privateKey,
        },
      });
      if (res.ok) {
        const data = (await res.json()) as {
          host: string;
          slug: string;
          isAdmin: boolean;
          isApi: boolean;
          franchise: Franchise;
          location: Location;
        };
        setFranchise(data.franchise);
        setLocation(data.location);
        setStatus(true);
      } else {
        reset();
        setStatus(false);
      }
    } catch (err) {
      reset();
      setStatus(false);
    }
  }, [url, privateKey, publicKey, reset, setFranchise, setLocation]);

  useEffect(() => {
    window.electron.ipcRenderer
      .getConfig()
      .then(async (newConfig) => {
        setKeys(newConfig.API.publicKey, newConfig.API.privateKey);
        await getCloudData();
        setIsLoading(false);
        return null;
      })
      .catch((err) => err);
    window.electron.ipcRenderer.clearConfigSave();
    window.electron.ipcRenderer.onConfigSave((newConfig) => {
      setKeys(newConfig.API.publicKey, newConfig.API.privateKey);
      getCloudData();
      setIsLoading(false);
    });
  }, [url, getCloudData, setKeys]);

  return (
    <Popover
      placement="bottom-end"
      initialFocusRef={initRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button
          variant="solid"
          colorScheme={status ? 'green' : 'red'}
          isLoading={isLoading}
          onClick={() => (isOpen ? onClose() : onOpen())}
        >
          {status ? <UilCloudCheck /> : <UilCloudSlash />}
        </Button>
      </PopoverTrigger>
      {status && franchise && location ? (
        <Portal>
          <Box zIndex={20}>
            <PopoverContent borderColor="green.400">
              <PopoverHeader bgColor="green.400" color="white">
                <Stack direction="row" spacing={2}>
                  <UilCloudCheck />
                  <Text>
                    {`${franchise.displayTitle.superTitle} ${franchise.displayTitle.title} ${franchise.displayTitle.subtitle}`.trim()}
                  </Text>
                </Stack>
              </PopoverHeader>
              <PopoverCloseButton color="white" />
              <PopoverBody>
                <Stack direction="row" spacing={4} alignItems="center">
                  <Stack
                    rounded="md"
                    w={20}
                    h={20}
                    alignItems="center"
                    justifyContent="center"
                    bgColor={altBg}
                    p={1}
                  >
                    <Image
                      src={franchise.logo.location}
                      alt={franchise.logo.alternativeText}
                      w="full"
                    />
                  </Stack>

                  <Stack>
                    <Heading size="md">{location.name}</Heading>
                    <Stack direction="row" spacing={2}>
                      {location.services.promotions && (
                        <Box
                          bg="gray.500"
                          rounded="md"
                          p={1}
                          color="white"
                          w="auto"
                        >
                          <UilAward />
                        </Box>
                      )}
                      {location.services.events && (
                        <Box bg="gray.500" rounded="md" p={1} color="white">
                          <UilTicket />
                        </Box>
                      )}
                      {location.services.olo && (
                        <Box bg="gray.500" rounded="md" p={1} color="white">
                          <UilShoppingBag />
                        </Box>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
                <Stack p={2} spacing={0} bgColor={altBg} rounded="md" mt={2}>
                  <Heading size="xs">Location Address</Heading>
                  <Text>
                    {location.address.street1}{' '}
                    {location.address.street2 && (
                      <>{location.address.street2}</>
                    )}
                  </Text>
                  <Text>{`${location.address.city}, ${location.address.state}`}</Text>
                </Stack>
                <Stack direction="row" justifyContent="space-between" mt={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Switch isDisabled isChecked={location.isActive} />
                    {location.isActive ? (
                      <Text>Active</Text>
                    ) : (
                      <Text>Inactive</Text>
                    )}
                  </Stack>
                  <Link
                    href={`${url.replace('api', `${franchise.slug}.admin`)}`}
                    isExternal
                    alignItems="center"
                    display="flex"
                  >
                    <Text mr={2}> Admin Portal</Text>
                    <UilExternalLinkAlt size={20} />
                  </Link>
                </Stack>
              </PopoverBody>
              <PopoverFooter>
                <Button size="sm" ref={initRef} onClick={onClose}>
                  Close
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Box>
        </Portal>
      ) : (
        <Portal>
          <Box zIndex={20}>
            <PopoverContent overflow="hidden" borderColor="red.400">
              <PopoverHeader bgColor="red.400" color="white">
                <Stack direction="row" spacing={2}>
                  <UilCloudSlash />
                  <Text>Error Loading Cloud Data</Text>
                </Stack>
              </PopoverHeader>
              <PopoverCloseButton color="white" />
              <PopoverBody>
                <Stack justifyContent="center">
                  <Text>
                    Cloud data could not be loaded. Please check your internet
                    connection and API keys.
                  </Text>
                </Stack>
              </PopoverBody>
              <PopoverFooter>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Button size="sm" ref={initRef} onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => getCloudData()}
                  >
                    Reconnect
                  </Button>
                </Stack>
              </PopoverFooter>
            </PopoverContent>
          </Box>
        </Portal>
      )}
    </Popover>
  );
};

export default CloudStatus;
