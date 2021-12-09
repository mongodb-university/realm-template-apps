import { useEffect, useState } from 'react';

export function useTimeout(fn, ms) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      fn();
    }, ms);
    return () => clearTimeout(timeout);
  }, [fn, ms]);
}

export function useShowLoader(loading, delayMs) {
  const [showLoader, setShowLoader] = useState(false);
  useTimeout(() => {
    if (loading) {
      setShowLoader(true);
    }
  }, [delayMs]);
  useEffect(() => {
    if (!loading) {
      setShowLoader(false);
    }
  }, [loading]);
  return showLoader;
}

export function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}
