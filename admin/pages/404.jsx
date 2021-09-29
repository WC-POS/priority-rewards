import { Heading, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { UilLinkBroken } from "@iconscout/react-unicons";

const Custom404 = () => {
  return (
    <Stack
      direction="row"
      w="100vw"
      h="100vh"
      p={4}
      bgColor="gray.600"
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
        maxW="2xl"
      >
        <VStack w="full" alignItems="flex-start" spacing={0}>
          <Text color="gray.500">Priority Rewards</Text>
          <HStack spacing={2} color="gray.500">
            <UilLinkBroken />
            <Heading size="lg" color="black">
              404 Page Not Found
            </Heading>
          </HStack>
        </VStack>
        <Text>
          We're sorry. We can't seem to find the page you're looking for. This
          URL does not exist or has not been set up yet. If you think this is an
          error on our part, please let us know.
        </Text>
      </VStack>
    </Stack>
  );
};

export default Custom404;
