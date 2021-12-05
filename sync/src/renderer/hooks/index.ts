import { useState } from 'react';

export function useEnvMode() {
  const mode = window.localStorage.getItem('env');
  const [modeState] = useState(mode || 'development');
  const [isDevelopmentState] = useState(mode === 'development');
  const url =
    mode === 'development'
      ? 'https://api.lvh.me'
      : 'https://api.priority-rewards.com';
  const [urlState] = useState(url);
  return {
    mode: modeState,
    isDevelopment: isDevelopmentState,
    url: urlState,
  };
}
