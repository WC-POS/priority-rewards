import { Stack, Text } from "@chakra-ui/react";

import React from "react";

const Body: React.FC = () => {
  return (
    <Stack
      direction="column"
      spacing={2}
      overflowY="auto"
      h="full"
      bg="white"
      rounded="lg"
      p={2}
    >
      <Text>Hello world</Text>
    </Stack>
  );
};

export default Body;
