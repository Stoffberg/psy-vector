/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useCallback, useEffect, useState } from "react";

const useSessionStorage = <T>(key: string, initialValue: T): [T, (value: T) => void, () => void] => {
  const initialize = (key: string) => {
    try {
      const item = sessionStorage.getItem(key);
      if (item && item !== "undefined") {
        return JSON.parse(item);
      }

      sessionStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch {
      return initialValue;
    }
  };

  const [state, setState] = useState<typeof initialValue>(initialValue);

  useEffect(() => {
    setState(initialize(key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = useCallback(
    (value: typeof initialValue) => {
      try {
        setState(value);
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    },
    [key, setState],
  );

  const remove = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  return [state, setValue, remove];
};

export default useSessionStorage;
