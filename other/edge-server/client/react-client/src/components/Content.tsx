import { useState } from "react";
import {
  Alert,
  AppBar,
  Button,
  Card,
  CardContent,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

import { LoginPage } from "../pages/LoginPage";
import { TodoItemsPage } from "../pages/TodoItemsPage";

import { useAuthContext } from "../providers/AuthProvider";
import { useAuth } from "../hooks/useAuth";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { EdgeConnectionStatus } from "../types";

export function Content() {
  const { logoutAndDisconnect } = useAuth();
  const { user } = useAuthContext();

  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [connectionString, setConnectionString] = useState("");

  const handleAuthResult = async (connectionResult: EdgeConnectionStatus) => {
    if (connectionResult.status == "disconnected") {
      setConnectionMessage(connectionResult.message);
      setShowError(true);
    } else if (connectionResult.error) {
      setConnectionMessage(connectionResult.message);
      setConnectionError(connectionResult.error);
      setShowError(true);
    } else {
      setConnectionString(connectionResult.connectionString);
      setConnectionMessage(connectionResult.message);
      setShowSuccess(true);
    }
  };

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            className="app-bar-title"
            component="h1"
            variant="h5"
          >
            Edge Server Wire Protocol App
          </Typography>
          {user && (
            <Button
              variant="contained"
              color="secondary"
              onClick={logoutAndDisconnect}
            >
              Log out
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container
        className="main-container"
        maxWidth="sm"
      >
        {showSuccess && (
          <Alert
            icon={<CheckCircleOutlineIcon fontSize="inherit" />}
            variant="outlined"
            severity="success"
            onClose={() => {
              setShowSuccess(false);
            }}
          >
            {connectionMessage}
          </Alert>
        )}

        {showError && (
          <Alert
            icon={<ErrorOutlineIcon fontSize="inherit" />}
            variant="outlined"
            severity="error"
            onClose={() => {
              setShowError(false);
            }}
          >
            <Typography component="p">{connectionMessage}</Typography>
            <Typography component="blockquote">{connectionError}</Typography>
          </Alert>
        )}

        {user && user.id ? (
          <div>
            <TodoItemsPage />

            <Card
              variant="outlined"
              className="connection-card"
            >
              <CardContent>
                <Typography
                  component="p"
                  variant="h5"
                >
                  Connected to Edge Server
                </Typography>
                <Typography component="p">{connectionString}</Typography>
              </CardContent>
            </Card>
          </div>
        ) : (
          <LoginPage handleAuthResult={handleAuthResult} />
        )}
      </Container>
    </div>
  );
}
