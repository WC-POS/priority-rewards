import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { UilEye, UilEyeSlash, UilUser } from "@iconscout/react-unicons";

import Blank from "../../../layouts/blank";
import NextLink from "next/link";
import { getFranchiseData } from "../../../lib/ssr/getFranchise";
import { getSlug } from "../../../lib/ssr/getSlug";
import { useRouter } from "next/router";

const Change = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    if (!password) {
      toast({
        title: "Missing Password",
        description: "Please fill out the password field.",
        status: "warning",
        duration: 10000,
        isClosable: true,
      });
      return false;
    } else if (!confirm) {
      toast({
        title: "Missing Password Confirmation",
        description: "Please fill out the confirm password field.",
        status: "warning",
        duration: 10000,
        isClosable: true,
      });
      return false;
    } else if (password !== confirm) {
      toast({
        title: "Password and Confirm do not match",
        description: "The provided password and confirm field do not match.",
        status: "warning",
        duration: 10000,
        isClosable: true,
      });
      return false;
    } else if (password.length < 8) {
      toast({
        title: "Password is not long enough",
        description: "Your new password must be at least 8 characters long.",
        status: "warning",
        duration: 10000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (isValid) {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://${props.franchise.slug}.${process.env.NEXT_PUBLIC_API_HOST}/admin/auth/register/change/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: props.codeId, password, confirm }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          router.push({
            pathname: "/auth/signin/",
            query: {
              email: data.email,
            },
          });
        } else {
          toast({
            title: "Something is not right...",
            description: data.error,
            duration: 10000,
            status: "warning",
            isClosable: true,
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        toast({
          title: "Uh oh...",
          description: "Something went wrong.",
          duration: 10000,
          status: "error",
          isClosable: true,
        });
        setIsLoading(false);
      }
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
        onSubmit={changePassword}
      >
        <VStack w="full" alignItems="flex-start" spacing={0}>
          <Text color="gray.500" align="center" w="full">
            {props.franchise.displayTitle.superTitle}{" "}
            {props.franchise.displayTitle.title}
          </Text>
          <Heading size="lg" align="center" w="full">
            Create Password
          </Heading>
        </VStack>
        <Stack
          direction="row"
          bg="blue.100"
          rounded="md"
          alignItems="center"
          color="blue.700"
          overflow="hidden"
        >
          <Stack bg="blue.600" color="white" p={2}>
            <UilUser />
          </Stack>
          <Text>{props.email}</Text>
        </Stack>
        <FormControl>
          <FormLabel>New Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="SecurePassword1234#"
              pr={16}
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
        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="SecurePassword1234#"
              pr={16}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
        <Button w="full" colorScheme="blue" isLoading={isLoading} type="submit">
          Set Password
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

Change.getLayout = (page) => {
  return <Blank>{page}</Blank>;
};

export async function getServerSideProps(context) {
  const franchise = await getFranchiseData(context);
  const slug = getSlug(context);
  console.log(context.query);
  if (franchise && franchise.slug !== "admin") {
    if (context.query.codeId && context.query.email) {
      console.log("getting check info");
      const url = `https://${slug}.${process.env.NEXT_PUBLIC_API_HOST}/admin/auth/register/check/${context.query.codeId}/`;
      const res = await fetch(url);
      console.log(res);
      if (res.ok) {
        const data = await res.json();
        return {
          props: {
            ...data,
            codeId: context.query.codeId,
            franchise,
          },
        };
      } else {
        return {
          props: {
            statusCode: 404,
          },
        };
      }
    } else {
      return {
        props: {
          statusCode: 404,
        },
      };
    }
  } else {
    return {
      props: {
        statusCode: 404,
      },
    };
  }
}

export default Change;
