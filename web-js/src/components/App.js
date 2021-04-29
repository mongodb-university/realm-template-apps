import { WelcomePage } from "./WelcomePage";
import { TodoItemsPage } from "./TodoItemsPage";
import { RealmAppProvider, useRealmApp } from "./RealmApp";
import { ThemeProvider } from "./Theme";
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import "./App.css";
import { appId } from "../realm.json"

export default function AppWithRealm() {
  return (
    <ThemeProvider>
      <RealmAppProvider appId={appId}>
        <App />
      </RealmAppProvider>
    </ThemeProvider>
  );
}

const API_TYPE = process.env.REACT_APP_API_TYPE
const TitleCaseNames = {
  "graphql": "GraphQL",
  "mql": "MQL",
  "local": "Local",
}
export const ApiTypeName = TitleCaseNames[API_TYPE]
if(!ApiTypeName) {
  throw new Error(`Invalid REACT_APP_API_TYPE: "${API_TYPE}". Specifiy "graphql", "mql", or "local" instead.`)
}
const AppName = `My ${ApiTypeName} App`

function App() {
  const { currentUser, logOut } = useRealmApp();
  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar>
          <Typography className="app-bar-title" component="h1" variant="h5">
            {AppName}
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
