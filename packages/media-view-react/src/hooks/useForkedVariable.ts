import { useRef, useMemo } from 'react';
export default function useForkedVariable<T>(initial: T, updater: (modify: (variable: T) => void) => void) {
  const forkedRef = useRef(initial);
  function modify(next: T) {
    forkedRef.current = next;
  }
  useMemo(() => {
    updater(modify);
  }, [initial]);
  return [forkedRef.current, modify] as const;
}
