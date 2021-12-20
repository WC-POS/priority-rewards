import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

import Blank from "../../../layouts/blank";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Redeem = (props) => {
  const toast = useToast();
  const [code, setCode] = useState(props.query.code || "");
  const [email, setEmail] = useState(props.query.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const verify = async (e) => {
    e.preventDefault();
    if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email.trim().toLowerCase()
      ) &&
      code.length === 8
    ) {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://${props.franchise.slug}.${process.env.NEXT_PUBLIC_API_HOST}/admin/auth/forgot/redeem/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.trim().toLowerCase(),
              code: code.trim(),
            }),
          }
        );
        const body = await res.json();
        if (res.ok) {
          setIsLoading(false);
          router.push({
            pathname: "/auth/forgot/change/",
            query: {
              email: body.email,
              codeId: body.codeId,
            },
          });
        } else {
          setIsLoading(false);
          toast({
            title: "Uh oh...",
            description: body.error,
            status: "error",
            duration: 10000,
            isClosable: true,
          });
        }
      } catch (err) {
        console.log(err);
        toast({
          title: "Uh oh...",
          description: "Something went wrong",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      }
    } else {
      setIsLoading(false);
      toast({
        title: "That's Not Right",
        description: "Please enter a valid email address and code.",
        status: "warning",
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
        onSubmit={verify}
      >
        <VStack w="full" alignItems="flex-start" spacing={0}>
          <Text color="gray.500" align="center" w="full">
            {props.franchise.displayTitle.superTitle}{" "}
            {props.franchise.displayTitle.title}
          </Text>
          <Heading size="lg" align="center" w="full">
            Verify Password Code
          </Heading>
        </VStack>
        <FormControl isRequired as="fieldset">
          <FormLabel>Email Address</FormLabel>
          <Input
            placeholder="jane.doe@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired as="fieldset">
          <FormLabel>Code</FormLabel>
          <Input
            maxLength={8}
            placeholder="12345678"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </FormControl>
        <Button w="full" colorScheme="blue" isLoading={isLoading} type="submit">
          Check Code
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

Redeem.getLayout = (page) => {
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
      return {};
    } else {
      return { props: { franchise: franchiseData, query: context.query } };
    }
  } else {
    return {
      props: {
        franchise: require("../../../lib/constants/admin-franchise.json"),
        query: context.query,
      },
    };
  }
}

export default Redeem;
