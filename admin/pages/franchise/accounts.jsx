import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
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
  UilCloudTimes,
  UilEnvelopeQuestion,
  UilEnvelopeRedo,
  UilListUl,
  UilSave,
  UilSync,
  UilTimes,
  UilTrash,
  UilUserPlus,
  UilUserTimes,
} from "@iconscout/react-unicons";
import { useAPIStore, useFranchiseStore } from "../../store";
import { useEffect, useRef, useState } from "react";

import PageHeader from "../../components/page-header";
import mailcheck from "mailcheck";

const AccountCreateModal = ({ isOpen, onClose, onCreate }) => {
  const [account, setAccount] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const fetchPost = useAPIStore((state) => state.fetchPost);

  const toast = useToast();

  const {
    isOpen: isSuggestionOpen,
    onClose: onSuggestionClose,
    onOpen: onSuggestionOpen,
  } = useDisclosure();
  const changeBtnRef = useRef(null);

  const checkEmail = () => {
    const suggestionObj = mailcheck.run({ email: account.email });
    if (suggestionObj && !isSuggestionOpen) {
      setSuggestion(suggestionObj.full);
      onSuggestionOpen();
    } else {
      setSuggestion("");
      onSuggestionClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (account.firstName && account.lastName && account.email) {
      setIsLoading(true);
      const res = await fetchPost("/admin/auth/accounts/", { ...account });
      if (res.ok) {
        onCreate();
        onClose();
      } else {
        toast({
          title: "Error Saving Admin Account",
          description:
            "Something went wrong. The admin account could not be saved.",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      }
      setIsLoading(false);
    } else {
      toast({
        title: "Missing Fields",
        description: "All admin account fields are required",
        status: "warning",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setAccount({ firstName: "", lastName: "", email: "" });
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalCloseButton />
        <ModalHeader>
          <Heading size="xl">New Admin Account</Heading>
        </ModalHeader>
        <ModalBody>
          <Stack direction="column">
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                variant="filled"
                value={account.firstName}
                onChange={(e) =>
                  setAccount({ ...account, firstName: e.target.value })
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                variant="filled"
                value={account.lastName}
                onChange={(e) =>
                  setAccount({ ...account, lastName: e.target.value })
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Popover
                isOpen={isSuggestionOpen}
                onClose={onSuggestionClose}
                placement="top"
                initialFocusRef={changeBtnRef}
              >
                <PopoverTrigger>
                  <Input
                    variant="filled"
                    value={account.email}
                    onBlur={checkEmail}
                    onChange={(e) =>
                      setAccount({ ...account, email: e.target.value })
                    }
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Are you sure?</PopoverHeader>
                  <PopoverBody>
                    Is that the correct email address? It seems very close to
                    <Text color="blue.500" decoration="underline">
                      {suggestion}
                    </Text>
                  </PopoverBody>
                  <PopoverFooter>
                    <Stack direction="row" alignItems="center">
                      <Button
                        w="full"
                        onClick={onSuggestionClose}
                        leftIcon={<UilTimes />}
                      >
                        Dismiss
                      </Button>
                      <Button
                        w="full"
                        leftIcon={<UilEnvelopeRedo />}
                        colorScheme="blue"
                        ref={changeBtnRef}
                        onClick={() => {
                          setAccount({ ...account, email: suggestion });
                          setSuggestion("");
                          onSuggestionClose();
                        }}
                      >
                        Change
                      </Button>
                    </Stack>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row" alignItems="center" w="full">
            <Button leftIcon={<UilTimes />} w="full" onClick={onClose}>
              Close
            </Button>
            <Button
              leftIcon={<UilUserPlus />}
              w="full"
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
            >
              Create
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const AccountEditModal = ({ isOpen, onClose, accountId, handleSave }) => {
  const [account, setAccount] = useState(undefined);
  const fetchGet = useAPIStore((state) => state.fetchGet);
  const fetchPost = useAPIStore((state) => state.fetchPost);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(true);
  const toast = useToast();

  const onSave = async () => {
    setIsLoading(true);
    const res = await fetchPost(
      `/admin/auth/account/${account._id}/`,
      account,
      true
    );
    if (!res.ok) {
      toast({
        title: "Error Saving Admin Account",
        description: "Some went wrong. The Admin Account could not be found.",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
    setIsLoading(false);
    handleSave();
    onClose();
  };

  const sendForgotPasswordEmail = async () => {
    setIsLoadingEmail(true);
    const res = await fetchPost("/admin/auth/forgot/", {
      email: account.email,
    });
    if (res.ok) {
      setIsLoadingEmail(false);
    } else {
      toast({
        title: "Could Not Send Email",
        description:
          "Something went wrong. The forgot password email was not sent out.",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
      setIsLoadingEmail(false);
    }
  };

  useEffect(async () => {
    if (isOpen && accountId) {
      const res = await fetchGet(`/admin/auth/account/${accountId}/`);
      if (res.ok) {
        setAccount(res.body);
      } else if (res.error) {
        setAccount(undefined);
      } else {
        setAccount(undefined);
      }
    } else {
      setIsLoadingEmail(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <ModalCloseButton />
        <ModalHeader>
          <Stack direction="row" alignItems="center">
            {account ? (
              <>
                <Avatar
                  size={"sm"}
                  name={`${account.firstName} ${account.lastName}`}
                  bgColor="gray.200"
                />
                <Heading size="xl">
                  {account.firstName} {account.lastName}
                </Heading>
              </>
            ) : (
              <Heading>Admin Account</Heading>
            )}
          </Stack>
        </ModalHeader>
        {account ? (
          <ModalBody>
            <Stack direction="column" spacing={2}>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  variant="filled"
                  value={account.firstName}
                  onChange={(e) =>
                    setAccount({ ...account, firstName: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  variant="filled"
                  value={account.lastName}
                  onChange={(e) =>
                    setAccount({ ...account, lastName: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email Address</FormLabel>
                <Input variant="filled" isDisabled value={account.email} />
              </FormControl>
              <Button
                leftIcon={<UilEnvelopeQuestion />}
                w="full"
                onClick={sendForgotPasswordEmail}
                isLoading={isLoadingEmail}
              >
                Reset Password
              </Button>
            </Stack>
          </ModalBody>
        ) : (
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            p={4}
          >
            <Box color="red.500">
              <UilCloudTimes size={48} />
            </Box>
            <Button leftIcon={<UilSync />}>Reload</Button>
          </Stack>
        )}

        <ModalFooter>
          <Stack direction="row" w="full">
            <Button
              w="full"
              onClick={onClose}
              leftIcon={<UilTimes />}
              isLoading={isLoading}
            >
              Close
            </Button>
            <Button
              w="full"
              colorScheme="blue"
              leftIcon={<UilSave />}
              isLoading={isLoading}
              type="submit"
            >
              Save
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [pageData, setPageData] = useState({ page: 1, maxPage: 1, count: 0 });
  const [status, setStatus] = useState("loading");

  const { fetchDelete, fetchGet } = useAPIStore((state) => ({
    fetchDelete: state.fetchDelete,
    fetchGet: state.fetchGet,
  }));
  const franchise = useFranchiseStore((state) => state.franchise);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onClose: onCreateClose,
    onOpen: onCreateOpen,
  } = useDisclosure();

  const cancelRef = useRef(null);
  const toast = useToast();

  const getAccounts = async () => {
    setStatus("loading");
    const res = await fetchGet("/admin/auth/accounts/");
    if (res.ok) {
      setPageData({
        page: res.body.page,
        maxPage: res.body.maxPage,
        count: res.body.count,
      });
      setAccounts(res.body.results);
      setStatus("loaded");
    } else {
      setStatus("error");
      toast({
        title: "Error Loading Accounts",
        description:
          "Something went wrong. Accounts could not be loaded from the API.",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    const res = await fetchDelete(`/admin/auth/account/${currentAccount}/`);
    if (!res.ok) {
      toast({
        title: "Error Deleting Admin Account",
        description:
          "Something went wrong. The Admin Account could not be deleted.",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
    setIsDeleteLoading(false);
    await getAccounts();
  };

  useEffect(async () => {
    const res = await fetchGet("/admin/auth/accounts/");
    if (res.ok) {
      setPageData({
        page: res.body.page,
        maxPage: res.body.maxPage,
        count: res.body.count,
      });
      setAccounts(res.body.results);
      setStatus("loaded");
    } else {
      setStatus("error");
    }
  }, []);

  return (
    <>
      <AlertDialog
        isOpen={isDeleteConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Admin Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteConfirmOpen(false)}
                w="full"
                leftIcon={<UilTimes />}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                isLoading={isDeleteLoading}
                onClick={() => {
                  handleDelete();
                  setIsDeleteConfirmOpen(false);
                }}
                ml={3}
                w="full"
                leftIcon={<UilUserTimes />}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AccountEditModal
        isOpen={isOpen}
        onClose={onClose}
        accountId={currentAccount}
        handleSave={getAccounts}
      />
      <AccountCreateModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onCreate={getAccounts}
      />
      <PageHeader
        title="Admin Accounts"
        subtitle={`${franchise.displayTitle.superTitle} ${franchise.displayTitle.title} ${franchise.displayTitle.subtitle}`.trim()}
        action={
          <Button
            colorScheme="blue"
            leftIcon={<UilUserPlus />}
            onClick={onCreateOpen}
          >
            Add New
          </Button>
        }
        status={status}
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
              <Th>Last Name</Th>
              <Th>First Name</Th>
              <Th>Email</Th>
              <Th isNumeric>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accounts.map((account) => (
              <Tr key={account._id}>
                <Td>
                  <Button
                    variant="link"
                    color="black"
                    fontWeight="normal"
                    tabIndex={-1}
                  >
                    {account.lastName}
                  </Button>
                </Td>
                <Td>
                  <Button
                    variant="link"
                    color="black"
                    fontWeight="normal"
                    tabIndex={-1}
                  >
                    {account.firstName}
                  </Button>
                </Td>
                <Td>
                  <Link href={`mailto:${account.email}`}>{account.email}</Link>
                </Td>
                <Td isNumeric>
                  <ButtonGroup isAttached>
                    <IconButton
                      colorScheme="blue"
                      icon={<UilListUl />}
                      onClick={() => {
                        setCurrentAccount(account._id);
                        onOpen();
                      }}
                    />
                    <IconButton
                      colorScheme="blue"
                      icon={<UilTrash />}
                      onClick={() => {
                        setCurrentAccount(account._id);
                        setIsDeleteConfirmOpen(true);
                      }}
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
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

export default Accounts;
