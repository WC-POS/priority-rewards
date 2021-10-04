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
import Blank from "../../layouts/blank";

const Forgot = (props) => {
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
        w={{ base: "full", md: "md" }}
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
    console.log(franchiseData);
    if (franchiseData === null) {
      context.res.statusCode = 404;
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

export default Forgot;
