import { Heading, Stack, Text } from "@chakra-ui/react";

const Clubs = () => {
  return (
    <Stack
      w="full"
      h="full"
      direction="row"
      alignItems="flex-start"
      justifyContent="start"
    >
      <Stack
        direction="column"
        bgColor="white"
        rounded="lg"
        shadow="lg"
        w={{ base: "50%", md: "25%" }}
        p={4}
      >
        <Heading w="full" fontSize="2xl">
          Clubs
        </Heading>
      </Stack>
      <Stack
        direction="column"
        bgColor="white"
        rounded="lg"
        shadow="lg"
        w={{ base: "50%", md: "75%" }}
        p={4}
      >
        <Text w="full">Hello</Text>
      </Stack>
    </Stack>
  );
};

export default Clubs;
