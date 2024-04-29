import { Button } from "@mui/material";

import { LoginPage } from "../pages/LoginPage";
import { TodoItemsPage } from "../pages/TodoItemsPage";

import { useAuthContext } from "../providers/AuthProvider";
import { useAuth } from "../hooks/useAuth";

export function Content() {
  const { logoutAndDisconnect } = useAuth();
  const { user } = useAuthContext();

  return (
    <div>
      {user && user.id ? <TodoItemsPage /> : <LoginPage />}
      {user && (
        <Button
          variant="contained"
          color="primary"
          onClick={logoutAndDisconnect}
        >
          Log out
        </Button>
      )}
    </div>
  );
}
