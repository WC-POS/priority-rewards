import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";

import React from "react";

const AppForm: React.FC<{
  data: {
    logOutput: string;
    quickSyncFrequency: number;
    fullSyncTime: string;
  };
}> = ({ data }) => {
  return (
    <Stack>
      <FormControl>
        <FormLabel>Log Output</FormLabel>
        <Input />
      </FormControl>
      <FormControl>
        <FormLabel>Quick Sync Frequency</FormLabel>
        <Input type="number" />
      </FormControl>
      <FormControl>
        <FormLabel>Full Sync Frequency</FormLabel>
        <Input type="time" />
      </FormControl>
    </Stack>
  );
};

export default AppForm;
