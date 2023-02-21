import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { WelcomePage } from "./WelcomePage";
import { TodoItemsPage } from "./TodoItemsPage";
// :state-start: prod-mql, prod-graphql
import { AppProvider, useApp } from "./RealmApp";
// :state-end:
// :state-uncomment-start: prod-data-api
// import { AppProvider, useApp } from "./DataApiApp";
// :state-uncomment-end:
import { ThemeProvider } from "./Theme";
import { AppName } from "./AppName";
import appConfig from "../realm.json";
import "./App.css";

const { appId } = appConfig;

export default function ProvidedApp() {
  return (
    <ThemeProvider>
      <AppProvider appId={appId}>
        <App />
      </AppProvider>
    </ThemeProvider>
  );
}

function App() {
  const { currentUser, logOut } = useApp();
  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar>
          <AppName />
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
