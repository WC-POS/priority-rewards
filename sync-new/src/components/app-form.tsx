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
} from "@chakra-ui/react";

import { DefaultConfig } from "../types";
import React from "react";

const AppForm: React.FC<{
  data: typeof DefaultConfig.app;
  onChange: (val: typeof DefaultConfig.app) => void;
}> = ({ data, onChange }) => {
  return (
    <Stack>
      <FormControl>
        <FormLabel>Quick Sync Frequency</FormLabel>
        <NumberInput
          min={1}
          value={data.quickSyncFrequency}
          onChange={(value) =>
            onChange({
              ...data,
              quickSyncFrequency: parseInt(value, 10),
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
      <FormControl>
        <FormLabel>Full Sync Frequency</FormLabel>

        <Input
          type="time"
          value={data.fullSyncTime}
          onChange={(e) => onChange({ ...data, fullSyncTime: e.target.value })}
        />
      </FormControl>
    </Stack>
  );
};

export default AppForm;
