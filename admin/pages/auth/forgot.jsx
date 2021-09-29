import NextLink from "next/link";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

function Forgot() {
  const toast = useToast();
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
          <Text color="gray.500">Priority Rewards</Text>
          <Heading size="lg">The Mall at Stonecrest</Heading>
        </VStack>
        <FormControl as="fieldset" isRequired>
          <FormLabel as="legend">Email Address</FormLabel>
          <Input placeholder="jane.doe@email.com" />
        </FormControl>
        <Button
          variant="solid"
          colorScheme="blue"
          onClick={() =>
            toast({
              title: "Incorrect Credentials",
              description:
                "An account with that email address and password could not be found.",
              status: "error",
              duration: 10000,
              isClosable: true,
            })
          }
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
}

export default Forgot;
