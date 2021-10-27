import { useEffect, useRef, useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  UilEditAlt,
  UilSave,
  UilTachometerFastAlt,
  UilTimes,
  UilUpload,
  UilUser,
  UilUserPlus,
} from "@iconscout/react-unicons";
import PaginateButtons from "../../components/paginate-buttons";
import PageHeader from "../../components/page-header";
import { useAPIStore, useFranchiseStore } from "../../store";

const customerTemplate = {
  lastName: "",
  firstName: "",
  email: "",
  phone: "",
  avatar: "",
};
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex =
  /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

const CustomerModal = (props) => {
  const [customer, setCustomer] = useState(customerTemplate);
  const lastNameInput = useRef(null);
  const fetchPost = useAPIStore((state) => state.fetchPost);
  const fetchUpload = useAPIStore((state) => state.fetchUpload);
  const [status, setStatus] = useState("loaded");
  const toast = useToast();
  const uploadInput = useRef(null);

  const close = () => {
    props.onClose();
    setCustomer(customerTemplate);
  };

  const onSave = async () => {
    if (!emailRegex.test(customer.email)) {
      toast({
        title: "Invalid Email Address",
        description: "Please enter a valid email address.",
        status: "warning",
        duration: 7000,
        isClosable: true,
      });
    } else if (!phoneRegex.test(customer.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        status: "warning",
        duration: 7000,
        isClosable: true,
      });
    } else if (!customer.lastName || !customer.firstName) {
      toast({
        title: "Missing Name",
        description: "Please enter the customer's first and last name.",
        status: "warning",
        duration: 7000,
        isClosable: true,
      });
    } else {
      let res = await fetchPost("/admin/membership/customers/", customer);
      if (res.ok) {
        props.onAdd ? props.onAdd(res.body) : "";
        setCustomer(customerTemplate);
        setStatus("loaded");
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
  };

  const uploadAvatar = async (e) => {
    if (e.target.files.length) {
      setStatus("loading");
      const files = [{ name: e.target.name, data: e.target.files[0] }];
      const res = await fetchUpload(
        "/admin/membership/customer/upload/avatar/",
        files
      );
      if (res.ok) {
        setCustomer({ ...customer, avatar: res.body.location });
        setStatus("loaded");
      } else {
        toast({
          title: "File Upload Error",
          description: "There was an error uploading your file.",
          status: "warning",
          duration: 7000,
          isClosable: true,
        });
        console.log(res.body.error);
        setStatus("loaded");
      }
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={close}
      size="lg"
      scrollBehavior="inside"
      initialFocusRef={lastNameInput}
    >
      <ModalOverlay />
      <ModalContent p={4}>
        <ModalCloseButton />
        <Heading size="xl">New Customer</Heading>
        <ModalBody px={2}>
          <Stack spacing={4}>
            <Stack direction="row" spacing={4} alignItems="center" w="full">
              <input
                name="avatar"
                id="avatar"
                ref={uploadInput}
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                onChange={uploadAvatar}
              />
              <Stack
                bg="gray.200"
                rounded="md"
                h={40}
                w={40}
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
                mx={{ base: "auto", md: 0 }}
                position="relative"
                overflow="hidden"
              >
                {customer.avatar ? (
                  <>
                    <Image
                      w="full"
                      h="full"
                      objectFit="contain"
                      src={customer.avatar}
                      alt="Customer Avatar"
                    />
                    <IconButton
                      icon={<UilTimes />}
                      position="absolute"
                      bottom={4}
                      left={4}
                      variant="ghost"
                      color="gray.600"
                      onClick={() => setCustomer({ ...customer, avatar: "" })}
                    />
                  </>
                ) : (
                  <IconButton
                    icon={<UilUpload />}
                    colorScheme="teal"
                    tabIndex={-1}
                    onClick={() => uploadInput.current.click()}
                  />
                )}
              </Stack>
              <Stack spacing={2} w="full">
                <FormControl isRequired>
                  <FormLabel ml={4}>Last Name</FormLabel>
                  <Input
                    ref={lastNameInput}
                    bg="gray.50"
                    onChange={(e) =>
                      setCustomer({ ...customer, lastName: e.target.value })
                    }
                    value={customer.lastName}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel ml={4}>First Name</FormLabel>
                  <Input
                    bg="gray.50"
                    onChange={(e) =>
                      setCustomer({ ...customer, firstName: e.target.value })
                    }
                    value={customer.firstName}
                  />
                </FormControl>
              </Stack>
            </Stack>
            <Stack spacing={2} bg="gray.100" p={4} rounded="md">
              <FormControl isRequired>
                <FormLabel ml={4}>Email</FormLabel>
                <Input
                  bg="white"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  value={customer.email}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel ml={4}>Phone</FormLabel>
                <Input
                  bg="white"
                  type="tel"
                  pattern="[\+]\d{2}[\(]\d{2}[\)]\d{4}[\-]\d{4}"
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  value={customer.phone}
                />
              </FormControl>
            </Stack>
          </Stack>

          <ModalFooter p={0} mt={4}>
            <Stack direction="row" spacing={4} w="full">
              <IconButton icon={<UilTimes />} onClick={close} />
              <Button
                leftIcon={<UilSave />}
                w="full"
                colorScheme="blue"
                isLoading={status === "loading"}
                onClick={onSave}
              >
                Save
              </Button>
            </Stack>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const Index = () => {
  const [customers, setCustomers] = useState([]);
  const fetchGet = useAPIStore((state) => state.fetchGet);
  const franchise = useFranchiseStore((state) => state.franchise);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pageData, setPageData] = useState({
    page: 1,
    size: 10,
    maxPage: 1,
  });
  const [status, setStatus] = useState("loading");
  const toast = useToast();

  const getCustomers = async () => {
    const res = await fetchGet("/admin/membership/customers/");
    if (res.ok) {
      setCustomers(res.body.results);
      setPageData({
        maxPage: res.body.maxPage,
        page: res.body.page,
        size: res.body.size,
      });
      setStatus("loaded");
    } else {
      toast({
        title: "Error",
        description: "Customer data could not be loaded.",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      setCustomers([]);
      setStatus("error");
    }
  };

  useEffect(async () => {
    await getCustomers();
  }, []);

  return (
    <>
      <CustomerModal isOpen={isOpen} onClose={onClose} onAdd={getCustomers} />
      <PageHeader
        status={status}
        title="Customers"
        subtitle={`${franchise.displayTitle.superTitle + " "}${
          franchise.displayTitle.title + " "
        }${franchise.displayTitle.subtitle}`}
        action={
          <Button
            leftIcon={<UilUserPlus />}
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
          {status === "error" && (
            <TableCaption color="red.400">
              Error Loading Customer Data
            </TableCaption>
          )}

          {status === "loaded" && customers.length === 0 && (
            <TableCaption>No Customer Data to display</TableCaption>
          )}
          <Thead>
            <Tr>
              <Th>Last Name</Th>
              <Th>First Name</Th>
              <Th>Email</Th>
              <Th isNumeric whiteSpace="nowrap">
                Current Points
              </Th>
              <Th isNumeric whiteSpace="nowrap">
                Lifetime Points
              </Th>
              <Th isNumeric whiteSpace="nowrap">
                Current Club
              </Th>
              <Th isNumeric>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers.map((customer) => (
              <Tr key={customer._id}>
                <Td>{customer.lastName}</Td>
                <Td>{customer.firstName}</Td>
                <Td>{customer.email}</Td>
                <Td isNumeric>{customer.points.current}</Td>
                <Td isNumeric>{customer.points.lifetime}</Td>
                <Td isNumeric>Club</Td>
                <Td isNumeric>
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
                    />
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <PaginateButtons
            status={status}
            page={pageData.page}
            maxPage={pageData.maxPage}
            size={pageData.size}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default Index;
