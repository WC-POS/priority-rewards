import React, { useEffect, useState } from 'react';

import { Button } from '@chakra-ui/react';
import { UilServerConnection } from '@iconscout/react-unicons';

const ConnectionStatus: React.FC = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.clearConnect();
    window.electron.ipcRenderer.onConnect((connectionStatus) => {
      setStatus(connectionStatus);
      setIsInitialLoad(false);
    });
  }, []);

  const attemptConnect = async () => {
    const config = await window.electron.ipcRenderer.getConfig();
    await window.electron.ipcRenderer.setConfig(config);
    setIsLoading(false);
  };

  return (
    <Button
      variant="solid"
      colorScheme={status ? 'green' : 'red'}
      isLoading={isLoading || isInitialLoad}
      onClick={() => {
        setIsLoading(true);
        attemptConnect();
      }}
    >
      <UilServerConnection />
    </Button>
  );
};

export default ConnectionStatus;
