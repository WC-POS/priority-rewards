import React, { useEffect, useState } from 'react';

import { Button } from '@chakra-ui/react';
import { UilServerConnection } from '@iconscout/react-unicons';
import { useFPOSStore } from 'renderer/store';

const ConnectionStatus: React.FC = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { connected, setConnected, setDB } = useFPOSStore((state) => ({
    connected: state.connected,
    setConnected: state.setConnected,
    setDB: state.setDB,
  }));

  useEffect(() => {
    window.electron.ipcRenderer.clearConnect();
    window.electron.ipcRenderer.onConnect((connectionStatus) => {
      setConnected(connectionStatus.connected);
      setDB(connectionStatus.db.name, connectionStatus.db.host);
      setIsInitialLoad(false);
    });
  }, [setConnected, setDB]);

  const attemptConnect = async () => {
    const config = await window.electron.ipcRenderer.getConfig();
    await window.electron.ipcRenderer.setConfig(config);
    setIsLoading(false);
  };

  return (
    <Button
      variant="solid"
      colorScheme={connected ? 'green' : 'red'}
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
