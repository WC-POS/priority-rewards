import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";

import React from "react";

const FposForm: React.FC<{
  data: {
    host: string;
    user: string;
    password: string;
    db: string;
  };
}> = ({ data }) => {
  return (
    <Stack>
      <FormControl>
        <FormLabel>Host</FormLabel>
        <Input />
      </FormControl>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input type="password" />
      </FormControl>
      <FormControl>
        <FormLabel>Database</FormLabel>
        <Input />
      </FormControl>
    </Stack>
  );
};

export default FposForm;
