/* eslint-disable no-underscore-dangle */
import {
  Box,
  Button,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Franchise, Location } from 'types';
import {
  UilAward,
  UilCloudTimes,
  UilSave,
  UilSync,
  UilTicket,
} from '@iconscout/react-unicons';
import { format, fromUnixTime } from 'date-fns';

export interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  franchise: Franchise;
  location: Location;
  onRefresh: () => void;
}

const DetailsModal = ({
  franchise,
  location,
  onRefresh,
  onClose,
  isOpen,
}: DetailsModalProps) => {
  const altBG = useColorModeValue('gray.100', 'gray.600');
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      {franchise && location ? (
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Stack direction="row" spacing={4}>
              <Box rounded="full" overflow="hidden" bg={altBG} p={2}>
                <Image
                  src={franchise.logo.location}
                  alt={franchise.logo.alternativeText}
                  objectFit="contain"
                  h={16}
                  w={16}
                />
              </Box>

              <Stack direction="column" spacing={0}>
                <Text
                  size="md"
                  fontWeight="light"
                >{`${`${franchise.displayTitle.superTitle} `}${`${franchise.displayTitle.title} `}${
                  franchise.displayTitle.subtitle
                }`}</Text>
                <Heading size="lg">{location.name}</Heading>
              </Stack>
            </Stack>
          </ModalHeader>
          <ModalBody>
            <Tabs isFitted variant="solid-rounded">
              <TabList>
                <Tab>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {location.isActive ? <></> : <UilCloudTimes />}
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
                  {location.services.promotions || location.services.events ? (
                    <Stack direction="row" w="full">
                      {location.services.promotions ? (
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
                      {location.services.events ? (
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
                      {location.address.street1}
                    </Text>
                    {location.address.street2 ? (
                      <Text>{location.address.street2}</Text>
                    ) : (
                      <></>
                    )}
                    <Text>
                      {`${location.address.city}, `}
                      {`${location.address.state} `}
                      {location.address.zipCode}
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
                    <Text>
                      {format(
                        fromUnixTime(location.updatedAt),
                        'MMM d, yyyy h:mma'
                      )}
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
                    <Text>{location._id}</Text>
                  </Stack>
                </TabPanel>
                {/* Franchise Panel */}
                <TabPanel px={0} py={4}>
                  {franchise.services.promotions ||
                  franchise.services.events ? (
                    <Stack direction="row" w="full">
                      {franchise.services.promotions ? (
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
                      {franchise.services.events ? (
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
                    <Text>{franchise._id}</Text>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter w="full">
            <Stack
              w="full"
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button variant="ghost" onClick={onRefresh}>
                <UilSync />
              </Button>
              <Button onClick={onClose}>Dismiss</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      ) : (
        <></>
      )}
    </Modal>
  );
};

export default DetailsModal;
