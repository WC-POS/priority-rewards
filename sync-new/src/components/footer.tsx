import { Button, IconButton, Stack } from "@chakra-ui/react";
import { UilCloudUpload, UilSetting } from "@iconscout/react-unicons";

import React from "react";

const Footer: React.FC<{ onSettingsClick: () => void }> = ({
  onSettingsClick,
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      w="full"
    >
      <Button leftIcon={<UilCloudUpload />} colorScheme="blue">
        Upload
      </Button>
      <IconButton
        icon={<UilSetting />}
        aria-label="Settings"
        onClick={onSettingsClick}
      />
    </Stack>
  );
};

export default Footer;
