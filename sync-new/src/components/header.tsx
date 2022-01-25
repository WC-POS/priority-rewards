import { Heading, IconButton, Stack, Tag } from "@chakra-ui/react";
import {
  UilCloudCheck,
  UilDatabase,
  UilInfoCircle,
} from "@iconscout/react-unicons";

import React from "react";

const Header = () => {
  return (
    <Stack
      direction="row"
      spacing={4}
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Heading>PriorityRewards</Heading>
        <Tag colorScheme="blue">Sync v0.1</Tag>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton icon={<UilInfoCircle />} aria-label="More Information" />
        <IconButton
          icon={<UilCloudCheck />}
          aria-label="More Information"
          colorScheme="green"
        />
        <IconButton
          icon={<UilDatabase />}
          aria-label="More Information"
          colorScheme="green"
        />
      </Stack>
    </Stack>
  );
};

export default Header;
