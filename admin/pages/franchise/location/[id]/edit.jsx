import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Image,
  Heading,
  IconButton,
  Input,
  Select,
  Spinner,
  Stack,
  Switch,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import {
  UilAngleRightB,
  UilBolt,
  UilImage,
  UilUpload,
} from "@iconscout/react-unicons";
import { useAPIStore, useFranchiseStore } from "../../../../store";

const LocationEdit = (props) => {
  const fetchGet = useAPIStore((state) => state.fetchGet);
  const fetchPost = useAPIStore((state) => state.fetchPost);
  const fetchUpload = useAPIStore((state) => state.fetchUpload);
  const franchise = useFranchiseStore((state) => state.franchise);
  const [location, setLocation] = useState({});
  const previewImageFile = useRef();
  const [stateOptions, setStateOptions] = useState([]);
  const [status, setStatus] = useState("loading");
  const router = useRouter();
  const toast = useToast();

  useEffect(async () => {
    const locationRes = await fetchGet(
      `/admin/franchise/location/${router.query.id}`
    );
    const stateRes = await fetchGet("/util/states/");
    if (locationRes.ok && stateRes.ok) {
      setLocation(locationRes.body);
      setStateOptions(stateRes.body);
      setStatus("loaded");
    } else {
      console.log(locationRes.error);
      console.log(stateRes.error);
    }
  }, []);

  const uploadFiles = async (e) => {
    if (e.target.files.length) {
      const files = [{ name: e.target.name, data: e.target.files[0] }];
      let res = await fetchUpload(
        `/admin/franchise/location/${location._id}/upload/${e.target.name}/`,
        files
      );
      console.log(res);
      if (res.ok) {
        setLocation({
          ...location,
          previewImage: {
            ...location.previewImage,
            location: res.body.location,
          },
        });
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
    if (
      location.name &&
      location.address.street1 &&
      location.address.street2 &&
      location.address.city &&
      location.address.state &&
      location.address.zipCode
    ) {
      let res = await fetchPost(
        `/admin/franchise/location/${location._id}/`,
        location,
        true
      );
      if (res.ok) {
        toast({
          title: "Location Updated",
          description: "Location details have been saved.",
          status: "success",
          duration: 7000,
          isClosable: true,
        });
      } else {
      }
    } else {
      toast({
        title: "Missing Fields",
        description: "Please fill out the name and address fields.",
        status: "warning",
        duration: 7000,
        isClosable: true,
      });
    }
  };

  return (
    <>
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
        <Stack direction="column" w="full">
          {location.name && <Heading size="xl">{location.name}</Heading>}
          <Breadcrumb spacing={2} separator={<UilAngleRightB />}>
            <BreadcrumbItem>
              <NextLink passHref href="/franchise/locations">
                <BreadcrumbLink>Locations</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <NextLink passHref href="#">
                <BreadcrumbLink>
                  {status === "loaded" ? <>{location.name}</> : <Spinner />}
                </BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Stack>
        <FormControl
          display="flex"
          flexDirection="column"
          w="auto"
          alignItems="center"
        >
          <FormLabel mb={0} ml={2} htmlFor="location-active">
            Active
          </FormLabel>
          <Switch
            id="location-active"
            mt={1}
            size="lg"
            onChange={(e) =>
              setLocation({
                ...location,
                isActive: e.target.checked,
              })
            }
            isChecked={status === "loaded" ? location.isActive : false}
          />
        </FormControl>
      </Stack>
      {location && status === "loaded" && (
        <Stack
          direction="column"
          w="full"
          bgColor="white"
          rounded="lg"
          shadow="lg"
          p={{ base: 4, md: 8 }}
          spacing={4}
        >
          <Heading size="lg">Location Information</Heading>
          <Divider />
          <Grid
            as="form"
            spacing={4}
            onSubmit={(e) => e.preventDefault()}
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
            gap={4}
            onSubmit={(e) => e.preventDefault}
          >
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                bg="gray.50"
                onChange={(e) =>
                  setLocation({ ...location, name: e.target.value })
                }
                value={status === "loaded" ? location.name : ""}
              />
            </FormControl>
            <GridItem rowSpan={{ base: 1, md: 3 }}>
              <Stack direction="column" bg="gray.50" rounded="md" mt={4} p={2}>
                <Heading size="lg">Address</Heading>
                <FormControl isRequired>
                  <FormLabel>Street Address</FormLabel>
                  <Input
                    bg="white"
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        address: {
                          ...location.address,
                          street1: e.target.value,
                        },
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
                        address: {
                          ...location.address,
                          street2: e.target.value,
                        },
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
                      <option
                        value={state.abbreviation}
                        key={state.abbreviation}
                      >
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
                        address: {
                          ...location.address,
                          zipCode: e.target.value,
                        },
                      })
                    }
                    value={location.address.zipCode}
                  />
                </FormControl>
              </Stack>
            </GridItem>
            <GridItem bg="gray.50" rounded="md" p={2}>
              <Heading size="lg">Service Options</Heading>
              <Divider mt={2} />
              <Stack direction="column" spacing={2} mt={2}>
                <FormControl display="flex" alignItems="center">
                  <Switch
                    id="service-promotions"
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        services: {
                          ...location.services,
                          promotions: e.target.checked,
                        },
                      })
                    }
                    isChecked={
                      status === "loaded" ? location.services.promotions : false
                    }
                    isDisabled={!franchise.services.promotions}
                  />
                  <FormLabel mb={0} ml={2} htmlFor="service-promotions">
                    Promotions
                  </FormLabel>
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <Switch
                    id="service-events"
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        services: {
                          ...location.services,
                          events: e.target.checked,
                        },
                      })
                    }
                    isChecked={
                      status === "loaded" ? location.services.events : false
                    }
                    isDisabled={!franchise.services.events}
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
                      setLocation({
                        ...location,
                        services: {
                          ...location.services,
                          olo: e.target.checked,
                        },
                      })
                    }
                    isChecked={
                      status === "loaded" ? location.services.olo : false
                    }
                  />
                  <FormLabel mb={0} ml={2} htmlFor="service-olo">
                    Online Ordering
                  </FormLabel>
                </FormControl>
              </Stack>
            </GridItem>
            <FormControl display="flex" h="full" flexDirection="column">
              <FormLabel>Private Notes</FormLabel>
              <Textarea
                h="full"
                bg="gray.50"
                onChange={(e) =>
                  setLocation({ ...location, notes: e.target.value })
                }
                value={status === "loaded" ? location.notes : ""}
              />
            </FormControl>
            <GridItem>
              <Stack>
                <Heading size="lg">Contact Information</Heading>
                <FormControl>
                  <FormLabel>Website</FormLabel>
                  <Input
                    bg="gray.50"
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        contact: {
                          ...location.contact,
                          website: e.target.value,
                        },
                      })
                    }
                    value={status === "loaded" ? location.contact.website : ""}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    bg="gray.50"
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        contact: {
                          ...location.contact,
                          email: e.target.value,
                        },
                      })
                    }
                    value={status === "loaded" ? location.contact.email : ""}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Support Phone</FormLabel>
                  <Input
                    bg="gray.50"
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        contact: {
                          ...location.contact,
                          phone: e.target.value,
                        },
                      })
                    }
                    value={status === "loaded" ? location.contact.phone : ""}
                  />
                </FormControl>
              </Stack>
            </GridItem>
            <GridItem>
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
                {status === "loaded" &&
                location.previewImage &&
                location.previewImage.location ? (
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
                      src={location.previewImage.location}
                      alt={
                        franchise.previewImage &&
                        franchise.previewImage.alternativeText
                          ? franchise.previewImage.alternativeText
                          : "Location Preview Image"
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
                      onClick={() => previewImageFile.current.click()}
                      tabIndex={-1}
                    />
                  </Stack>
                )}
                <Stack w="full" h="full" spacing={2}>
                  <Heading size="lg">Logo</Heading>
                  <FormControl>
                    <FormLabel>Alternative Text</FormLabel>
                    <Input
                      bg="white"
                      onChange={(e) =>
                        setLocation({
                          ...location,
                          previewImage: {
                            ...location.previewImage,
                            alternativeText: e.target.value,
                          },
                        })
                      }
                      value={
                        status === "loaded"
                          ? location.previewImage.alternativeText
                          : ""
                      }
                    />
                  </FormControl>
                  <input
                    type="file"
                    name="previewImage"
                    id="previewImage"
                    ref={previewImageFile}
                    style={{ display: "none" }}
                    accept="image/png, image/jpeg"
                    onChange={uploadFiles}
                  />
                  <Stack direction="row" w="full" spacing={4}>
                    <Button
                      leftIcon={<UilUpload />}
                      w="full"
                      colorScheme="teal"
                      onClick={() => previewImageFile.current.click()}
                    >
                      Upload
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </GridItem>
            <GridItem>
              <Heading size="lg">Payment</Heading>
              <Stack mt={2}>
                <FormControl>
                  <FormLabel>Provider</FormLabel>
                  <Select
                    bg="gray.50"
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        payment: {
                          ...location.payment,
                          provider: e.target.value,
                        },
                      })
                    }
                    value={status === "loaded" ? location.payment.provider : ""}
                  >
                    <option value="">Not Specified</option>
                    <option value="AUTHORIZE.NET">Authorize.net</option>
                    <option value="STRIPE">Stripe</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Public Key</FormLabel>
                  <Input
                    bg="gray.50"
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        payment: {
                          ...location.payment,
                          public: e.target.value,
                        },
                      })
                    }
                    value={status === "loaded" ? location.payment.public : ""}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Private Key</FormLabel>
                  <Input
                    bg="gray.50"
                    type="password"
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        payment: {
                          ...location.payment,
                          private: e.target.value,
                        },
                      })
                    }
                    value={status === "loaded" ? location.payment.private : ""}
                  />
                </FormControl>
              </Stack>
            </GridItem>
            <GridItem bg="gray.50" p={2} rounded="md">
              <Stack
                direction="row"
                w="full"
                alignItems="center"
                justifyContent="space-between"
              >
                <Heading size="lg">POS Integration</Heading>
                <IconButton
                  icon={<UilBolt />}
                  colorScheme="teal"
                  isDisabled={!location.pos.provider}
                />
              </Stack>
              <Stack mt={2}>
                <FormControl>
                  <FormLabel>Provider</FormLabel>
                  <Select
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        pos: {
                          ...location.pos,
                          provider: e.target.value,
                        },
                      })
                    }
                    value={status === "loaded" ? location.pos.provider : ""}
                    bg="white"
                  >
                    <option value="">Not Specified</option>
                    <option value="FPOS">FuturePOS</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Public Key</FormLabel>
                  <Input
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        pos: {
                          ...location.pos,
                          public: e.target.value,
                        },
                      })
                    }
                    value={status === "loaded" ? location.pos.public : ""}
                    bg="white"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Private Key</FormLabel>
                  <Input
                    type="password"
                    onChange={(e) =>
                      setLocation({
                        ...location,
                        pos: {
                          ...location.pos,
                          private: e.target.value,
                        },
                      })
                    }
                    value={status === "loaded" ? location.pos.private : ""}
                    bg="white"
                  />
                </FormControl>
              </Stack>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Button w="full" colorScheme="blue" size="lg" onClick={onSave}>
                Save
              </Button>
            </GridItem>
          </Grid>
        </Stack>
      )}
    </>
  );
};

export default LocationEdit;
