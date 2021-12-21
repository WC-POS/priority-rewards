import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

import Blank from "../../../layouts/blank";
import NextLink from "next/link";
import { getFranchiseData } from "../../../lib/ssr/getFranchise";
import { getSlug } from "../../../lib/ssr/getSlug";
import router from "next/router";

const Register = (props) => {
  const [code, setCode] = useState(props.code || "");
  const [email, setEmail] = useState(props.email || "");
  const [isLoading, setIsLoading] = useState(false);

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
          `https://${props.franchise.slug}.${process.env.NEXT_PUBLIC_API_HOST}/admin/auth/register/redeem/`,
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
            pathname: "/auth/register/change/",
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
        setIsLoading(false);
        toast({
          title: "Uh oh...",
          description: "Something went wrong.",
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
            Register Account
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

Register.getLayout = (page) => {
  return <Blank>{page}</Blank>;
};

export async function getServerSideProps(context) {
  const franchise = await getFranchiseData(context);
  const slug = getSlug(context);
  console.log(context.query);
  if (franchise && franchise.slug !== "admin") {
    return {
      props: {
        franchise,
        code: context.query.code,
        email: context.query.email,
      },
    };
  } else {
    return { props: { statusCode: 404 } };
  }
}

export default Register;
