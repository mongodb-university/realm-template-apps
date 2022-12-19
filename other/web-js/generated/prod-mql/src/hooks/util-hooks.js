import React from "react";

export function useTimeout(fn, ms) {
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fn();
    }, ms);
    return () => clearTimeout(timeout);
  }, [fn, ms]);
}

export function useShowLoader(loading, delayMs) {
  const [showLoader, setShowLoader] = React.useState(false);
  useTimeout(() => {
    if (loading) {
      setShowLoader(true);
    }
  }, [delayMs]);
  React.useEffect(() => {
    if (!loading) {
      setShowLoader(false);
    }
  }, [loading]);
  return showLoader;
}
