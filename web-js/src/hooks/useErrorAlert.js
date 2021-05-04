import React from "react";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function ErrorAlert({ isOpen, message, onClose = () => {} }) {
  return isOpen ? (
    <Alert onClose={onClose} severity="error">
      {message}
    </Alert>
  ) : null;
}

export function useErrorAlert({ error, clearError, hideAfterMs }) {
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);
  const clearErrorAlert = React.useCallback(() => {
    clearError();
    setShowErrorAlert(false);
  }, [clearError]);

  React.useEffect(() => {
    if (error) {
      setShowErrorAlert(true);
      if (hideAfterMs) {
        const timeout = setTimeout(() => {
          clearErrorAlert();
        }, hideAfterMs);
        return () => {
          clearTimeout(timeout);
        };
      }
    } else {
      setShowErrorAlert(false);
    }
  }, [error, clearErrorAlert, hideAfterMs]);

  return () => (
    <ErrorAlert
      isOpen={showErrorAlert}
      message={error}
      onClose={() => {
        clearErrorAlert();
      }}
    />
  );
}
