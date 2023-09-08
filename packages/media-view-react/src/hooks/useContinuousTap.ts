import { useRef } from 'react';
import useDebounceCallback from './useDebounceCallback';
export type TapFuncType<T> = (...args: T[]) => void;
export default function useContinuousTap<T>(singleTap: TapFuncType<T>, doubleTap: TapFuncType<T>): TapFuncType<T> {
  const continuousClick = useRef(0);
  const debounceTap = useDebounceCallback(
    (...args) => {
      continuousClick.current = 0;
      singleTap(...args);
    },
    {
      wait: 300,
    },
  );
  return function invokeTap(...args) {
    continuousClick.current += 1;
    debounceTap(...args);
    if (continuousClick.current >= 2) {
      debounceTap.cancel();
      continuousClick.current = 0;
      doubleTap(...args);
    }
  };
}
