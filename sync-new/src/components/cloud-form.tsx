import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";

import React from "react";

const CloudForm: React.FC<{
  data: { publicKey: string; privateKey: string };
  onChange: (val: { publicKey: string; privateKey: string }) => void;
}> = ({ data, onChange }) => {
  return (
    <Stack>
      <FormControl>
        <FormLabel>Public Key</FormLabel>
        <Input
          value={data.publicKey}
          onChange={(e) => onChange({ ...data, publicKey: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Private Key</FormLabel>
        <Input
          type="password"
          value={data.privateKey}
          onChange={(e) => onChange({ ...data, privateKey: e.target.value })}
        />
      </FormControl>
    </Stack>
  );
};

export default CloudForm;
