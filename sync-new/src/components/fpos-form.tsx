import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";

import { DefaultConfig } from "../types";
import React from "react";

const FposForm: React.FC<{
  data: typeof DefaultConfig.fpos;
  onChange: (val: typeof DefaultConfig.fpos) => void;
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
      <FormControl>
        <FormLabel>Database</FormLabel>
        <Input
          value={data.db}
          onChange={(e) => onChange({ ...data, db: e.target.value })}
        />
      </FormControl>
    </Stack>
  );
};

export default FposForm;
