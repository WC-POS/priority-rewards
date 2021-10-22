import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
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
  ModalOverlay,
  NumberDecrementStepper,
  NumberInput,
  NumberInputStepper,
  NumberInputField,
  NumberIncrementStepper,
  Spinner,
  Stack,
  Switch,
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
  UilBookmark,
  UilCloudSlash,
  UilCreateDashboard,
  UilEditAlt,
  UilPricetagAlt,
  UilSave,
  UilStar,
  UilTachometerFastAlt,
  UilTimes,
} from "@iconscout/react-unicons";
import { useAPIStore, useFranchiseStore } from "../../store";
import PageHeader from "../../components/page-header";

const clubTemplate = {
  name: "",
  isEntryClub: false,
  pointsEarnRate: 10,
  minimumPoints: 1000,
  isPaidClub: false,
  isExclusiveClub: false,
  paidClubRates: { monthly: 0.0, annual: 0.0 },
};

const ClubModal = (props) => {
  const [club, setClub] = useState(clubTemplate);
  const fetchPost = useAPIStore((state) => state.fetchPost);
  const [status, setStatus] = useState("loaded");
  const toast = useToast();

  const onSave = async () => {
    if (club.name) {
      setStatus("loading");
      if (club._id) {
        const res = await fetchPost(
          `/admin/membership/club/${club._id}/`,
          club,
          true
        );
        if (res.ok) {
          toast({
            title: `Updated Club`,
            description: `Club ${club.name} has been updated.`,
            status: "success",
            duration: 7000,
            isClosable: true,
          });
          props.onAdd(res.body);
          setStatus("loaded");
          props.onClose();
        } else {
          toast({
            title: "Error",
            description: "There was an error saving the club.",
            status: "error",
            duration: 7000,
            isClosable: true,
          });
        }
        setStatus("loaded");
      } else {
        const res = await fetchPost("/admin/membership/clubs", club);
        if (res.ok) {
          toast({
            title: "Added New Club",
            description: `Club ${club.name} has been added.`,
            status: "success",
            duration: 7000,
            isClosable: true,
          });
          props.onAdd(res.body);
          setStatus("loaded");
          props.onClose();
          setClub(clubTemplate);
        } else {
          toast({
            title: "Error",
            description: "There was an error saving the club.",
            status: "error",
            duration: 7000,
            isClosable: true,
          });
          setStatus("loaded");
        }
      }
    } else {
      toast({
        title: "Missing Fields",
        description: "Please fill out the name field.",
        status: "warning",
        duration: 7000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (props.isOpen) {
      if (props.editClub) {
        setClub(props.editClub);
      }
    } else {
      setClub(clubTemplate);
    }
  }, [props.isOpen]);

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
          <Heading size="xl">{club._id ? club.name : "New Club"}</Heading>
          <ModalBody px={2}>
            <Stack spacing={2}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  bg="gray.50"
                  onChange={(e) => setClub({ ...club, name: e.target.value })}
                  value={club.name}
                />
              </FormControl>
              <FormControl p={2} bg="gray.50" rounded="md">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormLabel my="auto">Is Entry Club</FormLabel>
                  <Switch
                    colorScheme="teal"
                    onChange={(e) =>
                      setClub({
                        ...club,
                        isEntryClub: e.target.checked,
                        minimumPoints: 0,
                      })
                    }
                    isChecked={club.isEntryClub}
                    isDisabled={club.isExclusiveClub || club.isPaidClub}
                  />
                </Stack>
              </FormControl>
              <FormControl p={2} bg="gray.50" rounded="md">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormLabel my="auto">Is Exclusive Club</FormLabel>
                  <Switch
                    colorScheme="teal"
                    onChange={(e) =>
                      setClub({
                        ...club,
                        isExclusiveClub: e.target.checked,
                        isEntryClub: false,
                        isPaidClub: false,
                        minimumPoints: 0,
                        paidClubRates: {
                          monthly: 0,
                          annual: 0,
                        },
                      })
                    }
                    isChecked={club.isExclusiveClub}
                  />
                </Stack>
              </FormControl>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <FormLabel w="full">Points Earn Rate / $</FormLabel>
                <NumberInput
                  step={1}
                  onChange={(val) =>
                    setClub({
                      ...club,
                      pointsEarnRate: val,
                    })
                  }
                  value={club.pointsEarnRate}
                >
                  <NumberInputField bg="gray.50" textAlign="right" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <FormLabel w="full">MinimumPoints</FormLabel>
                <NumberInput
                  step={100}
                  onChange={(val) =>
                    setClub({
                      ...club,
                      minimumPoints: val,
                    })
                  }
                  value={club.minimumPoints}
                  isDisabled={club.isEntryClub}
                >
                  <NumberInputField bg="gray.50" textAlign="right" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <Stack bg="gray.50" rounded="md" p={2}>
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  px={2}
                  pt={2}
                >
                  <FormLabel fontWeight="bold">Is Paid Club</FormLabel>
                  <Switch
                    colorScheme="teal"
                    onChange={(e) =>
                      setClub({
                        ...club,
                        isPaidClub: e.target.checked,
                        paidClubRates: {
                          ...club.paidClubRates,
                          monthly: 0,
                          annual: 0,
                        },
                      })
                    }
                    isChecked={club.isPaidClub}
                    isDisabled={club.isExclusiveClub}
                  />
                </FormControl>
                <Divider />
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormLabel whiteSpace="nowrap" w="full">
                    Monthly Cost
                  </FormLabel>
                  <NumberInput
                    precision={2}
                    step={0.2}
                    onChange={(val) =>
                      setClub({
                        ...club,
                        paidClubRates: { ...club.paidClubRates, monthly: val },
                      })
                    }
                    value={club.paidClubRates.monthly}
                    isDisabled={!club.isPaidClub}
                  >
                    <NumberInputField bg="white" textAlign="right" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormLabel whiteSpace="nowrap" w="full">
                    Annual Cost
                  </FormLabel>
                  <NumberInput
                    precision={2}
                    step={0.2}
                    onChange={(val) =>
                      setClub({
                        ...club,
                        paidClubRates: { ...club.paidClubRates, annual: val },
                      })
                    }
                    value={club.paidClubRates.annual}
                    isDisabled={!club.isPaidClub}
                  >
                    <NumberInputField bg="white" textAlign="right" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Stack>
              <FormControl p={2} bg="gray.50" rounded="md">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormLabel my="auto">Is Active</FormLabel>
                  <Switch
                    colorScheme="teal"
                    onChange={(e) =>
                      setClub({
                        ...club,
                        isActive: e.target.checked,
                      })
                    }
                    isChecked={club.isActive}
                  />
                </Stack>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter p={2}>
            <Stack
              direction="row"
              alignItems="center"
              w="full"
              spacing={2}
              p={0}
            >
              <Button leftIcon={<UilTimes />} onClick={props.onClose}>
                Close
              </Button>
              <Button
                w="full"
                colorScheme="blue"
                rightIcon={<UilSave />}
                onClick={onSave}
                isLoading={status === "loading"}
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

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [editClub, setEditClub] = useState(null);
  const fetchGet = useAPIStore((state) => state.fetchGet);
  const franchise = useFranchiseStore((state) => state.franchise);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [status, setStatus] = useState("loading");
  const toast = useToast();

  const addClub = (newClub) => {
    let newClubsArray = [];
    console.log(newClub._id);
    const filteredClubs = clubs.filter((club) => club._id !== newClub._id);
    console.log(JSON.parse(JSON.stringify(newClub)));
    console.log(JSON.parse(JSON.stringify(filteredClubs)));
    if (newClub.isEntryClub) {
      newClubsArray = [
        ...filteredClubs.map((club) => ({ ...club, isEntryClub: false })),
        newClub,
      ];
    } else {
      newClubsArray = [...filteredClubs, newClub];
    }
    newClubsArray.sort((first, second) =>
      first.isEntryClub || second.name > first.name ? -1 : 1
    );
    setClubs(newClubsArray);
  };

  useEffect(async () => {
    const res = await fetchGet("/admin/membership/clubs/");
    if (res.ok) {
      res.body.sort((first, second) =>
        first.isEntryClub || second.name > first.name ? -1 : 1
      );
      setClubs(res.body);
      setStatus("loaded");
    } else {
      toast({
        title: "Error",
        description: "Club data could not be loaded.",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      setStatus("error");
    }
  }, []);

  return (
    <>
      <ClubModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setEditClub(null);
        }}
        onAdd={addClub}
        editClub={editClub}
      />
      <PageHeader
        status={status}
        title="Clubs"
        subtitle={`${franchise.displayTitle.superTitle + " "}${
          franchise.displayTitle.title + " "
        }${franchise.displayTitle.subtitle}`}
        action={
          <Button
            leftIcon={<UilCreateDashboard />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Add New
          </Button>
        }
      />
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
              <Th isNumeric whiteSpace="nowrap">
                Minimum Points
              </Th>
              <Th isNumeric whiteSpace="nowrap">
                Points Earn Rate / $
              </Th>
              <Th isNumeric whiteSpace="nowrap">
                Active Members
              </Th>
              <Th isNumeric>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clubs.map((club) => (
              <Tr key={club._id} color={club.isActive ? "black" : "gray.400"}>
                <Td>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="start"
                    spacing={2}
                  >
                    {club.isEntryClub && (
                      <Box color="blue.500">
                        <UilBookmark />
                      </Box>
                    )}
                    {club.isPaidClub && (
                      <Box color="green.500">
                        <UilPricetagAlt />
                      </Box>
                    )}
                    {club.isExclusiveClub && (
                      <Box color="teal.500">
                        <UilStar />
                      </Box>
                    )}
                    <Text whiteSpace="nowrap">{club.name}</Text>
                  </Stack>
                </Td>
                <Td isNumeric>{club.minimumPoints}</Td>
                <Td isNumeric>{club.pointsEarnRate}</Td>
                <Td isNumeric>0</Td>
                <Td>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={0}
                    p={0}
                  >
                    <IconButton
                      roundedRight="none"
                      colorScheme="blue"
                      icon={<UilTachometerFastAlt />}
                    />
                    <IconButton
                      roundedLeft="none"
                      colorScheme="blue"
                      icon={<UilEditAlt />}
                      onClick={() => {
                        setEditClub(club);
                        onOpen();
                      }}
                    />
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </>
  );
};

export default Clubs;
