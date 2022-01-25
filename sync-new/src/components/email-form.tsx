import {
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Switch,
} from "@chakra-ui/react";

import React from "react";

const EmailForm: React.FC<{
  data: {
    host: string;
    user: string;
    password: string;
    port: number;
    useSSL: boolean;
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
      <Stack
        direction="row"
        w="full"
        alignItems="center"
        justifyContent="space-between"
      >
        <FormControl>
          <FormLabel>Port</FormLabel>
          <Input type="number" />
        </FormControl>
        <FormControl display="flex" flexDir="column" alignItems="flex-end">
          <FormLabel textAlign="right">Use SSL</FormLabel>
          <Switch mr={4} />
        </FormControl>
      </Stack>
    </Stack>
  );
};

export default EmailForm;
