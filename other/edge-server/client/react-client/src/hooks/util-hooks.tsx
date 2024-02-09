import React from "react";

export function useTimeout(fn: () => void, ms: number) {
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fn();
    }, ms);
    return () => clearTimeout(timeout);
  }, [fn, ms]);
}

export function useShowLoader(loading: boolean, delayMs: number) {
  const [showLoader, setShowLoader] = React.useState(false);

  useTimeout(() => {
    if (loading) {
      setShowLoader(true);
    }
  }, delayMs);

  React.useEffect(() => {
    if (!loading) {
      setShowLoader(false);
    }
  }, [loading]);

  return showLoader;
}
