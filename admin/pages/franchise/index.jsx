import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  UilCloudSlash,
  UilEye,
  UilHistoryAlt,
  UilImage,
  UilLock,
  UilMessage,
  UilUnlock,
  UilUpload,
  UilTrashAlt,
} from "@iconscout/react-unicons";
import { useAPIStore, useFranchiseStore } from "../../store";
import MDEditor from "../../components/md-editor";
import UnlockModal from "../../components/unlock-modal";

const Index = () => {
  const [detail, setDetail] = useState({});
  const fetchGet = useAPIStore((state) => state.fetchGet);
  const fetchPost = useAPIStore((state) => state.fetchPost);
  const fetchUpload = useAPIStore((state) => state.fetchUpload);
  const franchise = useFranchiseStore((state) => state.franchise);
  const [isLocked, setIsLocked] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const eulaFile = useRef();
  const logoFile = useRef();
  const mdEditor = useRef();
  const termsFile = useRef();
  const [status, setStatus] = useState("loading");
  const toast = useToast();

  useEffect(async () => {
    let res = await fetchGet("/admin/franchise/detail/");
    if (res.ok) {
      setDetail(res.body);
      mdEditor.current.setValue(res.body.welcomeMessage.body);
      setStatus("loaded");
    } else {
      setDetail({});
      setStatus("error");
      toast({
        title: "Loading Error",
        description: "There was an error loading the franchise details.",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      console.log(res.error);
    }
  }, []);

  const uploadFiles = async (e) => {
    if (e.target.files.length) {
      const files = [{ name: e.target.name, data: e.target.files[0] }];
      let res = await fetchUpload(
        `/admin/franchise/upload/${e.target.name}/`,
        files
      );
      if (res.ok) {
        if (e.target.name === "logo") {
          setDetail({
            ...detail,
            logo: { ...detail.logo, location: res.body.location },
          });
        } else if (e.target.name === "EULA") {
          setDetail({
            ...detail,
            documents: { ...detail.documents, EULA: res.body.location },
          });
        } else if (e.target.name === "terms") {
          setDetail({
            ...detail,
            documents: { ...detail.documents, termsOfUse: res.body.location },
          });
        }
      } else {
        toast({
          title: "File Upload Error",
          description: "There was an error uploading your file.",
          status: "warning",
          duration: 7000,
          isClosable: true,
        });
        console.log(res);
      }
    }
  };

  const onSave = async () => {
    if (detail.name && detail.displayTitle.title) {
      setStatus("loading");
      const res = await fetchPost("/admin/franchise/", detail, true);
      if (res.ok) {
        toast({
          title: "Franchise Updated",
          description: "Franchise details have been saved.",
          status: "success",
          duration: 7000,
          isClosable: true,
        });
        setStatus("loaded");
        setIsLocked(true);
      } else {
        toast({
          title: "Error on Save",
          description: "There was an error saving the franchise details.",
          status: "warning",
          duration: 7000,
          isClosable: true,
        });
        setStatus("loaded");
        console.log(res.error);
      }
    } else {
      toast({
        title: "Missing Fields",
        description:
          "Please fill out the Franchise Name and Display Title fields.",
        status: "warning",
        duration: 7000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <UnlockModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onAuth={() => setIsLocked(false)}
      />
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
          <Heading size="xl">Franchise Settings</Heading>
          <Text color="gray.600" fontSize="lg">
            {franchise.displayTitle.superTitle} {franchise.displayTitle.title}{" "}
            {franchise.displayTitle.subtitle}
          </Text>
        </Stack>
        {isLocked ? (
          <IconButton
            icon={status === "error" ? <UilCloudSlash /> : <UilLock />}
            variant="outline"
            colorScheme="red"
            onClick={onOpen}
            isLoading={status === "loading"}
            isDisabled={status !== "loaded"}
          />
        ) : (
          <IconButton
            icon={<UilUnlock />}
            variant="outline"
            onClick={() => setIsLocked(true)}
            isLoading={status === "loading"}
            isDisabled={status !== "loaded"}
          />
        )}
      </Stack>
      <Stack
        direction="column"
        w="full"
        bgColor="white"
        rounded="lg"
        shadow="lg"
        p={{ base: 4, md: 8 }}
        spacing={4}
      >
        <Heading size="lg">Franchise Information</Heading>
        <Divider />
        <Grid
          as="form"
          spacing={4}
          onSubmit={(e) => e.preventDefault()}
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
          gap={4}
        >
          <FormControl isDisabled={isLocked}>
            <FormLabel>Franchise Name</FormLabel>
            <Input
              bg="gray.50"
              onChange={(e) => setDetail({ ...detail, name: e.target.value })}
              value={status === "loaded" ? detail.name : ""}
            />
          </FormControl>
          <GridItem rowSpan={3} as={Box} bg="gray.50" rounded="md" p={4}>
            <Stack spacing={{ base: 1, md: 2 }} spacing={4}>
              <div>
                <Heading as="h4" size="lg">
                  Display Title
                </Heading>
                <Divider mt={4} />
              </div>
              <FormControl isDisabled={isLocked}>
                <FormLabel>Super Title</FormLabel>
                <Input
                  bg="white"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      displayTitle: {
                        ...detail.displayTitle,
                        superTitle: e.target.value,
                      },
                    })
                  }
                  value={
                    status === "loaded" ? detail.displayTitle.superTitle : ""
                  }
                />
              </FormControl>
              <FormControl isDisabled={isLocked}>
                <FormLabel>Primary Title</FormLabel>
                <Input
                  bg="white"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      displayTitle: {
                        ...detail.displayTitle,
                        title: e.target.value,
                      },
                    })
                  }
                  value={status === "loaded" ? detail.displayTitle.title : ""}
                />
              </FormControl>
              <FormControl isDisabled={isLocked}>
                <FormLabel>Subtitle</FormLabel>
                <Input
                  bg="white"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      displayTitle: {
                        ...detail.displayTitle,
                        subtitle: e.target.value,
                      },
                    })
                  }
                  value={
                    status === "loaded" ? detail.displayTitle.subtitle : ""
                  }
                />
              </FormControl>
            </Stack>
          </GridItem>
          <GridItem rowSpan={2}>
            <Stack
              bg="gray.50"
              direction={{ base: "column", md: "row" }}
              spacing={4}
              p={2}
              rounded="md"
              h="full"
              w="full"
              justifyContent={{ base: "center", md: "flex-start" }}
            >
              {status === "loaded" && detail.logo && detail.logo.location ? (
                <Stack
                  w="250px"
                  h="250px"
                  rounded="md"
                  bg="gray.100"
                  overflow="hidden"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Image
                    w="full"
                    h="full"
                    objectFit="contain"
                    src={detail.logo.location}
                    alt={
                      franchise.logo && franchise.logo.alternativeText
                        ? franchise.logo.alternativeText
                        : "Franchise Logo"
                    }
                  />
                </Stack>
              ) : (
                <Stack
                  bg="gray.200"
                  rounded="md"
                  h={250}
                  w={250}
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  mx={{ base: "auto", md: 0 }}
                >
                  <IconButton
                    icon={<UilImage />}
                    p={4}
                    colorScheme="teal"
                    variant="ghost"
                    onClick={() => logoFile.current.click()}
                    tabIndex={-1}
                  />
                </Stack>
              )}

              <Stack w="full" h="full" spacing={2}>
                <Heading size="lg">Logo</Heading>
                <FormControl isDisabled={isLocked}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    bg="white"
                    onChange={(e) =>
                      setDetail({
                        ...detail,
                        logo: {
                          ...detail.logo,
                          description: e.target.value,
                        },
                      })
                    }
                    value={status === "loaded" ? detail.logo.description : ""}
                  />
                </FormControl>
                <FormControl isDisabled={isLocked}>
                  <FormLabel>Alternative Text</FormLabel>
                  <Input
                    bg="white"
                    onChange={(e) =>
                      setDetail({
                        ...detail,
                        logo: {
                          ...detail.logo,
                          alternativeText: e.target.value,
                        },
                      })
                    }
                    value={
                      status === "loaded" ? detail.logo.alternativeText : ""
                    }
                  />
                </FormControl>
                <input
                  type="file"
                  name="logo"
                  id="logo"
                  ref={logoFile}
                  style={{ display: "none" }}
                  accept="image/png, image/jpeg"
                  onChange={uploadFiles}
                />
                <Stack direction="row" w="full" spacing={4}>
                  <IconButton
                    variant="ghost"
                    icon={<UilHistoryAlt />}
                    colorScheme="red"
                    px={8}
                    isDisabled={isLocked}
                    onClick={() =>
                      setDetail({ ...detail, logo: franchise.logo })
                    }
                  />

                  <Button
                    leftIcon={<UilUpload />}
                    w="full"
                    colorScheme="teal"
                    isDisabled={isLocked}
                    onClick={() => logoFile.current.click()}
                  >
                    Upload
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </GridItem>
          <Stack bg="gray.50" rounded="md" p={4} spacing={4}>
            <Heading size="lg">Service Options</Heading>
            <Divider />
            <Stack direction="column" spacing={4}>
              <FormControl display="flex" alignItems="center">
                <Switch
                  isDisabled={isLocked}
                  id="service-promotions"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      services: {
                        ...detail.services,
                        promotions: e.target.checked,
                      },
                    })
                  }
                  isChecked={
                    status === "loaded" ? detail.services.promotions : false
                  }
                />
                <FormLabel mb={0} ml={2} htmlFor="service-promotions">
                  Promotions
                </FormLabel>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <Switch
                  isDisabled={isLocked}
                  id="service-events"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      services: {
                        ...detail.services,
                        events: e.target.checked,
                      },
                    })
                  }
                  isChecked={
                    status === "loaded" ? detail.services.events : false
                  }
                />
                <FormLabel mb={0} ml={2} htmlFor="service-events">
                  Events
                </FormLabel>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <Switch
                  isDisabled
                  id="service-olo"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      services: {
                        ...detail.services,
                        olo: e.target.checked,
                      },
                    })
                  }
                  isChecked={status === "loaded" ? detail.services.olo : false}
                />
                <FormLabel mb={0} ml={2} htmlFor="service-olo">
                  Online Ordering
                </FormLabel>
              </FormControl>
            </Stack>
          </Stack>
          <GridItem>
            <Stack>
              <Heading size="lg">Contact Information</Heading>
              <FormControl isDisabled={isLocked}>
                <FormLabel>Website</FormLabel>
                <Input
                  bg="gray.50"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      contact: {
                        ...detail.contact,
                        website: e.target.checked,
                      },
                    })
                  }
                  value={status === "loaded" ? detail.contact.website : ""}
                />
              </FormControl>
              <FormControl isDisabled={isLocked}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  bg="gray.50"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      contact: {
                        ...detail.contact,
                        email: e.target.value,
                      },
                    })
                  }
                  value={status === "loaded" ? detail.contact.email : ""}
                />
              </FormControl>
              <FormControl isDisabled={isLocked}>
                <FormLabel>Support Phone</FormLabel>
                <Input
                  bg="gray.50"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      contact: {
                        ...detail.contact,
                        phone: e.target.value,
                      },
                    })
                  }
                  value={status === "loaded" ? detail.contact.phone : ""}
                />
              </FormControl>
            </Stack>
          </GridItem>
          <GridItem
            colSpan={{ base: 1, md: 2 }}
            bg="gray.50"
            rounded="md"
            p={4}
          >
            <Stack spacing={4}>
              <Heading size="lg">Welcome Message</Heading>
              <FormControl isDisabled={isLocked}>
                <FormLabel>Title</FormLabel>
                <Input
                  bg="white"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      welcomeMessage: {
                        ...detail.welcomeMessage,
                        title: e.target.value,
                      },
                    })
                  }
                  value={status === "loaded" ? detail.welcomeMessage.title : ""}
                />
              </FormControl>
              <MDEditor
                isLocked={isLocked}
                onChange={(text) =>
                  setDetail({
                    ...detail,
                    welcomeMessage: { ...detail.welcomeMessage, body: text },
                  })
                }
                ref={mdEditor}
              />
            </Stack>
          </GridItem>
          <GridItem bg="gray.50" rounded="md" p={4}>
            <Heading size="lg">Documents</Heading>
            <Stack mt={2}>
              <FormControl isDisabled>
                <input
                  type="file"
                  name="EULA"
                  id="EULA"
                  ref={eulaFile}
                  style={{ display: "none" }}
                  accept="application/pdf"
                  onChange={uploadFiles}
                />
                <FormLabel>EULA</FormLabel>
                <Stack direction="row" spacing={2}>
                  <IconButton
                    icon={<UilEye />}
                    variant="ghost"
                    isDisabled={
                      isLocked || !detail.documents || !detail.documents.EULA
                    }
                    as="a"
                    href={detail.documents ? detail.documents.EULA : ""}
                    target="_blank"
                  />
                  <Input
                    bg="white"
                    value={detail.documents ? detail.documents.EULA : ""}
                  />
                  <Button
                    leftIcon={<UilUpload />}
                    colorScheme="teal"
                    isDisabled={isLocked}
                    px={8}
                    onClick={() => eulaFile.current.click()}
                  >
                    Upload
                  </Button>
                </Stack>
              </FormControl>
              <FormControl isDisabled>
                <input
                  type="file"
                  name="terms"
                  id="terms"
                  ref={termsFile}
                  style={{ display: "none" }}
                  accept="application/pdf"
                  onChange={uploadFiles}
                />
                <FormLabel>Terms of Use</FormLabel>
                <Stack direction="row" spacing={2}>
                  <IconButton
                    icon={<UilEye />}
                    variant="ghost"
                    isDisabled={
                      isLocked ||
                      !detail.documents ||
                      !detail.documents.termsOfUse
                    }
                    as="a"
                    href={detail.documents ? detail.documents.termsOfUse : ""}
                    target="_blank"
                  />
                  <Input
                    bg="white"
                    value={detail.documents ? detail.documents.termsOfUse : ""}
                  />
                  <Button
                    leftIcon={<UilUpload />}
                    colorScheme="teal"
                    isDisabled={isLocked}
                    px={8}
                    onClick={() => termsFile.current.click()}
                  >
                    Upload
                  </Button>
                </Stack>
              </FormControl>
            </Stack>
          </GridItem>
          <GridItem>
            <Heading size="lg">Payment</Heading>
            <Stack mt={2}>
              <FormControl isDisabled={isLocked}>
                <FormLabel>Provider</FormLabel>
                <Select
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      payment: {
                        ...detail.payment,
                        provider: e.target.value,
                      },
                    })
                  }
                  value={status === "loaded" ? detail.payment.provider : ""}
                >
                  <option value="">Not Specified</option>
                  <option value="AUTHORIZE.NET">Authorize.net</option>
                  <option value="STRIPE">Stripe</option>
                </Select>
              </FormControl>
              <FormControl isDisabled={isLocked}>
                <FormLabel>Public Key</FormLabel>
                <Input
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      payment: {
                        ...detail.payment,
                        public: e.target.value,
                      },
                    })
                  }
                  value={status === "loaded" ? detail.payment.public : ""}
                />
              </FormControl>
              <FormControl isDisabled={isLocked}>
                <FormLabel>Private Key</FormLabel>
                <Input
                  type="password"
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      payment: {
                        ...detail.payment,
                        private: e.target.value,
                      },
                    })
                  }
                  value={status === "loaded" ? detail.payment.private : ""}
                />
              </FormControl>
            </Stack>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Button
              w="full"
              colorScheme="blue"
              isDisabled={isLocked}
              size="lg"
              onClick={onSave}
            >
              Save
            </Button>
          </GridItem>
        </Grid>
      </Stack>
    </>
  );
};

export default Index;
