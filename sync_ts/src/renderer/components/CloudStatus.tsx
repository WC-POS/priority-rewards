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

import { useEnvMode } from 'renderer/hooks';

const CloudStatus: React.FC = () => {
  const altBg = useColorModeValue('gray.200', 'gray.600');
  const initRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [keys, setKeys] = useState({
    publicKey: '',
    privateKey: '',
  });
  const [cloudData, setCloudData] = useState<{
    location?: Location;
    franchise?: Franchise;
  }>({});
  const [status, setStatus] = useState(false);
  const { url } = useEnvMode();

  const getCloudData = useCallback(
    async (publicKey: string, privateKey: string) => {
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
          setCloudData({
            location: data.location,
            franchise: data.franchise,
          });
          setStatus(true);
        } else {
          setCloudData({});
          setStatus(false);
        }
      } catch (err) {
        setCloudData({});
        setStatus(false);
      }
    },
    [url]
  );

  useEffect(() => {
    window.electron.ipcRenderer
      .getConfig()
      .then(async (newConfig) => {
        setKeys({
          publicKey: newConfig.API.publicKey,
          privateKey: newConfig.API.privateKey,
        });
        await getCloudData(newConfig.API.publicKey, newConfig.API.privateKey);
        setIsLoading(false);
        return null;
      })
      .catch((err) => err);
    window.electron.ipcRenderer.clearConfigSave();
    window.electron.ipcRenderer.onConfigSave((newConfig) => {
      setKeys({
        publicKey: newConfig.API.publicKey,
        privateKey: newConfig.API.privateKey,
      });
      getCloudData(newConfig.API.publicKey, newConfig.API.privateKey);
      setIsLoading(false);
    });
  }, [url, getCloudData]);

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
      {status && cloudData.franchise && cloudData.location ? (
        <PopoverContent borderColor="green.400">
          <PopoverHeader bgColor="green.400" color="white">
            <Stack direction="row" spacing={2}>
              <UilCloudCheck />
              <Text>
                {`${cloudData.franchise.displayTitle.superTitle} ${cloudData.franchise.displayTitle.title} ${cloudData.franchise.displayTitle.subtitle}`.trim()}
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
                  src={cloudData.franchise.logo.location}
                  alt={cloudData.franchise.logo.alternativeText}
                  w="full"
                />
              </Stack>

              <Stack>
                <Heading size="md">{cloudData.location.name}</Heading>
                <Stack direction="row" spacing={2}>
                  {cloudData.location.services.promotions && (
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
                  {cloudData.location.services.events && (
                    <Box bg="gray.500" rounded="md" p={1} color="white">
                      <UilTicket />
                    </Box>
                  )}
                  {cloudData.location.services.olo && (
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
                {cloudData.location.address.street1}{' '}
                {cloudData.location.address.street2 && (
                  <>{cloudData.location.address.street2}</>
                )}
              </Text>
              <Text>{`${cloudData.location.address.city}, ${cloudData.location.address.state}`}</Text>
            </Stack>
            <Stack direction="row" justifyContent="space-between" mt={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Switch isDisabled isChecked={cloudData.location.isActive} />
                {cloudData.location.isActive ? (
                  <Text>Active</Text>
                ) : (
                  <Text>Inactive</Text>
                )}
              </Stack>
              <Link
                href={`${url.replace(
                  'api',
                  `${cloudData.franchise.slug}.admin`
                )}`}
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
      ) : (
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
                onClick={() => getCloudData(keys.publicKey, keys.privateKey)}
              >
                Reconnect
              </Button>
            </Stack>
          </PopoverFooter>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default CloudStatus;
