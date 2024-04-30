import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";

import { LoginPage } from "../pages/LoginPage";
import { TodoItemsPage } from "../pages/TodoItemsPage";

import { useAuthContext } from "../providers/AuthProvider";
import { useAuth } from "../hooks/useAuth";

export function Content() {
  const { logoutAndDisconnect } = useAuth();
  const { user } = useAuthContext();

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
        {user && user.id ? <TodoItemsPage /> : <LoginPage />}
      </Container>
    </div>
  );
}
