import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { WelcomePage } from "./WelcomePage";
import { TodoItemsPage } from "./TodoItemsPage";
import { DataApiProvider, useDataApi } from "../hooks/useDataApi";
import { ThemeProvider } from "./Theme";
import { AppName } from "./AppName";
import atlasConfig from "../atlasConfig.json";
import "./App.css";
const { appId } = atlasConfig;

const location = { deployment_model: "GLOBAL" };
export default function ProvidedApp() {
  return (
    <ThemeProvider>
      <DataApiProvider appId={appId} location={location}>
        <App />
      </DataApiProvider>
    </ThemeProvider>
  );
}

function App() {
  const { currentUser, logOut } = useDataApi();
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
