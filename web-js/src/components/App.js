import { WelcomePage } from "./WelcomePage";
import { TodoItemsPage } from "./TodoItemsPage";
import { RealmAppProvider, useRealmApp } from "./RealmApp";
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import "./App.css";

// const APP_ID = "template-ihgiv"
export const APP_ID = "todo-sync-tmikv"

export default function AppWithRealm() {
  return (
    <RealmAppProvider appId={APP_ID}>
      <App />
    </RealmAppProvider>
  );
}

function App() {
  const { currentUser, logOut } = useRealmApp();
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography className="app-bar-title" component="h1" variant="h5">
            My GraphQL App
          </Typography>
          {currentUser ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={async () => {
                await logOut();
              }}
            >
              <Typography variant="button">Log Out</Typography>
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>

      {currentUser ? <TodoItemsPage /> : <WelcomePage />}
    </div>
  );
}
