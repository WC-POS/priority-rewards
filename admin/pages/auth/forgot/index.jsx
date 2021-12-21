import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

import Blank from "../../../layouts/blank";
import NextLink from "next/link";
import mailcheck from "mailcheck";
import { useRouter } from "next/router";

const Forgot = (props) => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const changeBtnRef = useRef(null);
  const router = useRouter();

  const close = () => {
    setIsOpen(false);
  };

  const validate = () => {
    const suggestionObj = mailcheck.run({ email });
    if (suggestionObj) {
      if (isDismissed) {
        return true;
      } else if (isLoading) {
        return false;
      } else {
        setSuggestion(suggestionObj.full);
        setIsOpen(true);
        return false;
      }
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
      return;
    } else if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email.toLowerCase().trim()
      )
    ) {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://${props.franchise.slug}.${process.env.NEXT_PUBLIC_API_HOST}/admin/auth/forgot/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );
        const body = await res.json();
        if (res.ok) {
          router.push({
            pathname: "/auth/forgot/redeem",
            query: { email: email.trim().toLowerCase() },
          });
        } else {
          setIsLoading(false);
          toast({
            title: "Uh oh",
            description: body.error,
            status: "warning",
            duration: 10000,
            isClosable: true,
          });
        }
      } catch {
        toast({
          title: "Uh oh",
          description: "Something went wrong...",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Invalid Email",
        description:
          "The email address you provided doesn't seem to be formatted properly.",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack
      direction="row"
      w="100vw"
      h="100vh"
      p={4}
      alignItems="center"
      justifyContent="center"
    >
      <VStack
        bgColor="white"
        p={8}
        textColor="gray.800"
        boxShadow="lg"
        rounded="lg"
        spacing={4}
        alignItems="stretch"
        w={{ base: "full", md: "md" }}
        as="form"
        onSubmit={submit}
      >
        <VStack w="full" alignItems="flex-start" spacing={0}>
          <Text color="gray.500" align="center" w="full">
            {props.franchise.displayTitle.superTitle}{" "}
            {props.franchise.displayTitle.title}
          </Text>
          <Heading size="lg" align="center" w="full">
            Forgot Password?
          </Heading>
        </VStack>
        <FormControl as="fieldset" isRequired>
          <FormLabel as="legend">Email Address</FormLabel>
          <Popover
            isOpen={isOpen}
            onClose={close}
            placement="top"
            initialFocusRef={changeBtnRef}
          >
            <PopoverTrigger>
              <Input
                placeholder="jane.doe@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Are you sure?</PopoverHeader>
              <PopoverBody bg="white">
                Is that the correct email address? It seems very close to
                <Text color="blue.500" decoration="underline">
                  {suggestion}
                </Text>
              </PopoverBody>
              <PopoverFooter>
                <Stack direction="row" alignItems="center">
                  <Button
                    w="full"
                    onClick={() => {
                      close();
                      setIsDismissed(true);
                    }}
                  >
                    Dismiss
                  </Button>
                  <Button
                    w="full"
                    colorScheme="blue"
                    ref={changeBtnRef}
                    onClick={() => {
                      close();
                      setEmail(suggestion);
                      setSuggestion("");
                    }}
                  >
                    Change
                  </Button>
                </Stack>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </FormControl>
        <Button
          variant="solid"
          colorScheme="blue"
          type="submit"
          isLoading={isLoading}
        >
          Send Code
        </Button>
        <NextLink href="/auth/signin" passHref>
          <Button variant="ghost" size="sm" as="a">
            Back to Signin
          </Button>
        </NextLink>
      </VStack>
    </Stack>
  );
};

Forgot.getLayout = (page) => {
  return <Blank>{page}</Blank>;
};

export async function getServerSideProps(context) {
  const slug = context.req.headers.host.toLowerCase().split(".")[0];
  if (slug !== "admin") {
    const url = `https://${slug}.${process.env.NEXT_PUBLIC_API_HOST}/admin/franchise/`;
    const res = await fetch(url);
    const franchiseData = await res.json();
    if (franchiseData === null) {
      context.res.statusCode = 404;
      return { props: {} };
    } else {
      return { props: { franchise: franchiseData } };
    }
  } else {
    return {
      props: {
        franchise: require("../../../lib/constants/admin-franchise.json"),
      },
    };
  }
}

export default Forgot;
