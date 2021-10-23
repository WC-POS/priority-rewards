import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Input,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  UilArrowLeft,
  UilArrowRight,
  UilAward,
  UilCloudSlash,
  UilCreateDashboard,
  UilDocumentLayoutLeft,
  UilEditAlt,
  UilSave,
  UilShoppingBag,
  UilTachometerFastAlt,
  UilTicket,
  UilTimes,
} from "@iconscout/react-unicons";
import { useAPIStore, useFranchiseStore } from "../../store";

const NewLocationModal = (props) => {
  const fetchGet = useAPIStore((state) => state.fetchGet);
  const fetchPost = useAPIStore((state) => state.fetchPost);
  const [location, setLocation] = useState({
    name: "",
    address: {
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    services: {
      events: false,
      promotions: false,
      olo: false,
    },
  });
  const router = useRouter();
  const [stateOptions, setStateOptions] = useState([]);
  const [status, setStatus] = useState("loading");
  const toast = useToast();

  const onSave = async () => {
    if (
      location.name &&
      location.address.street1 &&
      location.address.street2 &&
      location.address.city &&
      location.address.state &&
      location.address.zipCode
    ) {
      let res = await fetchPost("/admin/franchise/locations/", location);
      if (res.ok) {
        setStatus("loaded");
        router.push(`/franchise/location/${res.body._id}/edit/`);
      } else {
        setStatus("error");
      }
    } else {
      toast({
        title: "Missing Fields",
        description: "Please fill out the name and address fields.",
        status: "warning",
        duration: 7000,
        isClosable: true,
      });
      setStatus("loaded");
    }
  };

  useEffect(async () => {
    let res = await fetchGet("/util/states/");
    if (res.ok) {
      setStateOptions(res.body);
      setStatus("loaded");
    } else {
      console.log(res.error);
      setStatus("error");
    }
  }, []);

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent p={4}>
          <ModalCloseButton />
          <Heading size="xl">New Location</Heading>
          <ModalBody px={2}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                bg="gray.50"
                onChange={(e) =>
                  setLocation({ ...location, name: e.target.value })
                }
                value={location.name}
              />
            </FormControl>
            <Stack direction="column" bg="gray.50" rounded="md" mt={4} p={2}>
              <Heading size="lg">Address</Heading>
              <FormControl isRequired>
                <FormLabel>Street Address</FormLabel>
                <Input
                  bg="white"
                  onChange={(e) =>
                    setLocation({
                      ...location,
                      address: { ...location.address, street1: e.target.value },
                    })
                  }
                  value={location.address.street1}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Street Address 2 (Apt, Ste, etc.)</FormLabel>
                <Input
                  bg="white"
                  onChange={(e) =>
                    setLocation({
                      ...location,
                      address: { ...location.address, street2: e.target.value },
                    })
                  }
                  value={location.address.street2}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>City</FormLabel>
                <Input
                  bg="white"
                  onChange={(e) =>
                    setLocation({
                      ...location,
                      address: { ...location.address, city: e.target.value },
                    })
                  }
                  value={location.address.city}
                />
              </FormControl>
              <FormControl id="state-options" isRequired>
                <FormLabel>State</FormLabel>
                <Select
                  id="state-options"
                  bg="white"
                  placeholder="US State or Territory"
                  onChange={(e) =>
                    setLocation({
                      ...location,
                      address: { ...location.address, state: e.target.value },
                    })
                  }
                  value={location.address.state}
                >
                  {stateOptions.map((state) => (
                    <option value={state.abbreviation} key={state.abbreviation}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Zip Code</FormLabel>
                <Input
                  bg="white"
                  onChange={(e) =>
                    setLocation({
                      ...location,
                      address: { ...location.address, zipCode: e.target.value },
                    })
                  }
                  value={location.address.zipCode}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter justifyContent="center" w="full" mt={2} px={2}>
            <Button leftIcon={<UilTimes />} onClick={props.onClose} mr={1}>
              Close
            </Button>
            <Button
              w="full"
              colorScheme="blue"
              rightIcon={<UilSave />}
              ml={1}
              onClick={onSave}
              isLoading={status === "loading"}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Locations = () => {
  const fetchGet = useAPIStore((state) => state.fetchGet);
  const franchise = useFranchiseStore((state) => state.franchise);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [locations, setLocations] = useState([]);
  const [pageData, setPageData] = useState({ page: 1, maxPage: 1, count: 0 });
  const [status, setStatus] = useState("loading");

  useEffect(async () => {
    let res = await fetchGet("/admin/franchise/locations/");
    if (res.ok) {
      setPageData({
        page: res.body.page,
        maxPage: res.body.maxPage,
        count: res.body.count,
      });
      setLocations(res.body.results);
      setStatus("loaded");
    } else {
      setStatus("error");
    }
    console.log(res);
  }, []);

  return (
    <>
      <NewLocationModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      <Stack
        direction={{ base: "column", md: "row" }}
        w="full"
        bgColor="white"
        rounded="lg"
        shadow="lg"
        justifyContent="space-between"
        alignItems="center"
        px={{ base: 4, md: 8 }}
        py={4}
      >
        <Stack direction="column">
          <Heading size="xl">Locations</Heading>
          <Text color="gray.600" fontSize="lg">
            {franchise.displayTitle.superTitle} {franchise.displayTitle.title}{" "}
            {franchise.displayTitle.subtitle}
          </Text>
        </Stack>
        <Button
          leftIcon={<UilCreateDashboard />}
          colorScheme="blue"
          onClick={onOpen}
        >
          Add New
        </Button>
      </Stack>
      <Stack
        bg="white"
        rounded="lg"
        shadow="md"
        w="full"
        pb={4}
        overflowX="auto"
      >
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Address</Th>
              <Th isNumeric>Services</Th>
              <Th isNumeric>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {locations.map((location) => {
              return (
                <Tr key={location._id}>
                  <Td>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-start"
                      spacing={2}
                    >
                      {!location.isActive && (
                        <Box color="red.500">
                          <UilCloudSlash />
                        </Box>
                      )}
                      <NextLink
                        href={`/franchise/location/${location._id}/edit/`}
                        passHref
                      >
                        <Link whiteSpace="nowrap">{location.name}</Link>
                      </NextLink>
                    </Stack>
                  </Td>
                  <Td whiteSpace="nowrap">
                    {location.address.street1} {location.address.street2},{" "}
                    {location.address.city}, {location.address.state}{" "}
                    {location.address.zipCode}
                  </Td>
                  <Td isNumeric>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
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
                  </Td>
                  <Td isNumeric>
                    <Stack
                      direction="row"
                      spacing={0}
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <IconButton
                        icon={<UilTachometerFastAlt />}
                        roundedRight="none"
                        colorScheme="blue"
                      />
                      <IconButton
                        icon={<UilDocumentLayoutLeft />}
                        rounded="none"
                        colorScheme="blue"
                      />
                      <NextLink
                        href={`/franchise/location/${location._id}/edit/`}
                        passHref
                      >
                        <IconButton
                          icon={<UilEditAlt />}
                          as="a"
                          roundedLeft="none"
                          colorScheme="blue"
                        />
                      </NextLink>
                    </Stack>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          py={4}
        >
          <ButtonGroup isAttached>
            <IconButton
              icon={<UilArrowLeft />}
              colorScheme="blue"
              isDisabled={
                pageData.page <= pageData.maxPage || pageData.maxPage === 0
              }
            />
            <Button
              variant="ghost"
              colorScheme="blue"
              isLoading={status === "loading"}
            >
              {pageData.page} / {pageData.maxPage ? pageData.maxPage : 1}
            </Button>
            <IconButton
              icon={<UilArrowRight />}
              colorScheme="blue"
              isDisabled={pageData.page >= pageData.maxPage}
            />
          </ButtonGroup>
        </Stack>
      </Stack>
    </>
  );
};

export default Locations;
