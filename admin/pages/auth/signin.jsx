import NextLink from "next/link";
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

const SignIn = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveToken, setSaveToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => setShowPassword(!showPassword);
  const toast = useToast();

  const attemptSignin = async () => {
    if (email && password) {
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
      } else {
        toast({
          title: "Incorrect Credentials",
          description: data.error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
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
        w={{ base: "full", md: "auto" }}
      >
        <VStack w="full" alignItems="flex-start" spacing={0}>
          <Text color="gray.500">
            {props.franchise.displayTitle.superTitle}
          </Text>
          <Heading size="lg">{props.franchise.displayTitle.title}</Heading>
          <Text color="gray.500">{props.franchise.displayTitle.subtitle}</Text>
        </VStack>
        <FormControl as="fieldset" isRequired>
          <FormLabel as="legend">Email Address</FormLabel>
          <Input
            placeholder="jane.doe@email.com"
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
        <Button variant="solid" colorScheme="blue" onClick={attemptSignin}>
          Sign In
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

export async function getServerSideProps(context) {
  const slug = context.req.headers.host.toLowerCase().split(".")[0];

  if (slug !== "admin") {
    const url = `https://${slug}.${process.env.NEXT_PUBLIC_API_HOST}/admin/franchise/`;
    const res = await fetch(url);
    const franchiseData = await res.json();
    console.log(franchiseData);
    if (franchiseData === null) {
      context.res.statusCode = 302;
      context.res.setHeader("Location", "/404/");
      return { props: {} };
    } else {
      return { props: { franchise: franchiseData } };
    }
  } else {
    return {
      props: { franchise: require("../../lib/constants/admin-franchise.json") },
    };
  }
}

export default SignIn;
