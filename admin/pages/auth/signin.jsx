import NextLink from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Switch,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { UilEye, UilEyeSlash } from "@iconscout/react-unicons";

import Blank from "../../layouts/blank";
import { useAccountStore, useAPIStore, useFranchiseStore } from "../../store";

const SignIn = (props) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [saveToken, setSaveToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => setShowPassword(!showPassword);

  const setAccount = useAccountStore((state) => state.setAccount);
  const setSlug = useAPIStore((state) => state.setSlug);
  const setToken = useAPIStore((state) => state.setToken);
  const setFranchise = useFranchiseStore((state) => state.setFranchise);
  const toast = useToast();

  useEffect(() => {
    setSlug(props.franchise.slug);
  }, []);

  const attemptSignin = async (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      const res = await fetch(
        `https://${props.franchise.slug}.${process.env.NEXT_PUBLIC_API_HOST}/admin/auth/signin/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setFranchise(data.franchise);
        delete data.franchise;
        setToken(data.token);
        sessionStorage.setItem(`${props.franchise.slug}-token`, data.token.key);
        sessionStorage.setItem(
          `${props.franchise.slug}-token-expiry`,
          data.token.expiresAt
        );
        if (saveToken) {
          localStorage.setItem(`${props.franchise.slug}-token`, data.token.key);
          localStorage.setItem(
            `${props.franchise.slug}-token-expiry`,
            data.token.expiresAt
          );
        }
        delete data.token;
        setAccount(data);
        router.push("/");
      } else {
        toast({
          title: "Incorrect Credentials",
          description: data.error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    } else if (!email) {
      toast({
        title: "Missing Email Address",
        description: "Please enter your email address into the email field.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Missing Password",
        description:
          "Please enter your account password into the password field.",
        status: "error",
        duration: 5000,
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
      bgColor="gray.50"
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
        onSubmit={attemptSignin}
      >
        <VStack w="full" alignItems="flex-start" spacing={0}>
          <Text color="gray.500" align="center" w="full">
            {props.franchise.displayTitle.superTitle}
          </Text>
          <Heading size="lg" align="center" w="full">
            {props.franchise.displayTitle.title}
          </Heading>
          <Text color="gray.500" align="center" w="full">
            {props.franchise.displayTitle.subtitle}
          </Text>
        </VStack>
        <FormControl as="fieldset" isRequired>
          <FormLabel as="legend">Email Address</FormLabel>
          <Input
            placeholder="jane.doe@email.com"
            isDisabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl as="fieldset" isRequired>
          <FormLabel as="legend">Password</FormLabel>
          <InputGroup size="md">
            <Input
              placeholder="SecurePassword1234#"
              pr={16}
              type={showPassword ? "text" : "password"}
              isDisabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement w={16}>
              <Button
                size="sm"
                mx={1}
                w="full"
                variant="ghost"
                onClick={handleShowPasswordClick}
              >
                {showPassword ? (
                  <UilEyeSlash size="20" />
                ) : (
                  <UilEye size="20" />
                )}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="full"
        >
          <FormLabel mb={0} mr={2} htmlFor="save-login">
            Stay signed in?
          </FormLabel>
          <Switch
            id="save-login"
            checked={saveToken}
            onChange={(e) => setSaveToken(e.target.checked)}
          />
        </FormControl>
        <Button
          variant="solid"
          colorScheme="blue"
          type="submit"
          isLoading={isLoading}
        >
          <span>Sign In</span>
        </Button>

        <NextLink href="/auth/forgot" passHref>
          <Button variant="ghost" size="sm" as="a">
            Forgot Password?
          </Button>
        </NextLink>
      </VStack>
    </Stack>
  );
};

SignIn.getLayout = (page) => {
  return <Blank>{page}</Blank>;
};

export async function getServerSideProps(context) {
  const slug = context.req.headers.host.toLowerCase().split(".")[0];

  if (slug !== "admin") {
    try {
      const url = `https://${slug}.${process.env.NEXT_PUBLIC_API_HOST}/admin/franchise/`;
      const res = await fetch(url);
      const franchiseData = await res.json();
      if (franchiseData === null) {
        context.res.statusCode = 404;
        return {
          props: {
            statusCode: 404,
          },
        };
      } else {
        return { props: { franchise: franchiseData } };
      }
    } catch (err) {
      console.log(err);
      return {
        props: {
          statusCode: 404,
        },
      };
    }
  } else {
    return {
      props: { franchise: require("../../lib/constants/admin-franchise.json") },
    };
  }
}

export default SignIn;
