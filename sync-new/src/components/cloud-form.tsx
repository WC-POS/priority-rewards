import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";

import React from "react";

const CloudForm: React.FC<{
  data: { publicKey: string; privateKey: string };
}> = ({ data }) => {
  return (
    <Stack>
      <FormControl>
        <FormLabel>Public Key</FormLabel>
        <Input />
      </FormControl>
      <FormControl>
        <FormLabel>Private Key</FormLabel>
        <Input type="password" />
      </FormControl>
    </Stack>
  );
};

export default CloudForm;
