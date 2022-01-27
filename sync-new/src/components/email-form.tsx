import {
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Switch,
} from "@chakra-ui/react";

import { DefaultConfig } from "../types";
import React from "react";

const EmailForm: React.FC<{
  data: typeof DefaultConfig.email;
  onChange: (val: typeof DefaultConfig.email) => void;
}> = ({ data, onChange }) => {
  return (
    <Stack>
      <FormControl>
        <FormLabel>Host</FormLabel>
        <Input
          value={data.host}
          onChange={(e) => onChange({ ...data, host: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          value={data.user}
          onChange={(e) => onChange({ ...data, user: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={data.password}
          onChange={(e) => onChange({ ...data, password: e.target.value })}
        />
      </FormControl>
      <Stack
        direction="row"
        w="full"
        alignItems="center"
        justifyContent="space-between"
      >
        <FormControl>
          <FormLabel>Port</FormLabel>
          <NumberInput
            min={1}
            value={data.port}
            onChange={(value) =>
              onChange({
                ...data,
                port: parseInt(value, 10),
              })
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl display="flex" flexDir="column" alignItems="flex-end">
          <FormLabel textAlign="right">Use SSL</FormLabel>
          <Switch
            mr={4}
            isChecked={data.useSSL}
            onChange={(e) => onChange({ ...data, useSSL: e.target.checked })}
          />
        </FormControl>
      </Stack>
    </Stack>
  );
};

export default EmailForm;
