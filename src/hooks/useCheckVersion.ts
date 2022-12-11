import { useEffect, useState } from 'react';
import axios from 'axios';

const DEFAULT_REFRESH_RATE = 60000;

export interface UseCheckVersionOptions {
  refreshRate: number;
}

let currentVersion: string | undefined = undefined;

const useCheckVersion = (
  options: UseCheckVersionOptions
): [boolean, (e: React.MouseEvent) => void] => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkVersion = async () => {
    try {
      const { data: latestVersion } = await axios.get(
        `/version.json?${Date.now()}`
      );

      if (currentVersion && latestVersion) {
        setUpdateAvailable(currentVersion !== latestVersion);
      } else {
        currentVersion = latestVersion;
      }
    } catch {
      console.error('Unable to check new dapp version');
    }
  };

  useEffect(() => {
    checkVersion();

    const interval = setInterval(() => {
      if (!document.hidden) {
        checkVersion();
      }
    }, options.refreshRate ?? DEFAULT_REFRESH_RATE);

    return () => {
      clearInterval(interval);
    };
  }, [updateAvailable]);

  const refreshPage = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.reload();
  };

  return [updateAvailable, refreshPage];
};

export default useCheckVersion;
