import { useEffect, useState } from "react";

export function useTimeout(fn: () => void, ms: number) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      fn();
    }, ms);
    return () => clearTimeout(timeout);
  }, [fn, ms]);
}

export function useShowLoader(loading: boolean, delayMs: number) {
  const [showLoader, setShowLoader] = useState(false);

  useTimeout(() => {
    if (loading) {
      setShowLoader(true);
    }
  }, delayMs);

  useEffect(() => {
    if (!loading) {
      setShowLoader(false);
    }
  }, [loading]);

  return showLoader;
}
