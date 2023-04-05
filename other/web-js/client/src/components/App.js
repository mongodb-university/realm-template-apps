import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { WelcomePage } from "./WelcomePage";
import { TodoItemsPage } from "./TodoItemsPage";
// :state-start: development
import { API_TYPE_NAME } from "../components/AppName";
// :state-end:
// :state-start: prod-mql prod-graphql
import { AppProvider, useApp } from "./RealmApp";
// :state-end:
// :state-start: prod-data-api
import { DataApiProvider, useDataApi } from "../hooks/useDataApi";
// :state-end:
import { ThemeProvider } from "./Theme";
import { AppName } from "./AppName";
import atlasConfig from "../atlasConfig.json";
import "./App.css";
const { appId } = atlasConfig;

// :state-start: development
export default function ProvidedApp() {
  const Provider = API_TYPE_NAME === "Data API" ? DataApiProvider : AppProvider;
  const location = API_TYPE_NAME === "Data API" ? { deployment_model: "GLOBAL" } : {};
  return (
    <ThemeProvider>
      <Provider appId={appId} location={location}>
        <App />
      </Provider>
    </ThemeProvider>
  );
}
// :state-end:
// :state-uncomment-start: prod-mql
// export default function ProvidedApp() {
//   return (
//     <ThemeProvider>
//       <AppProvider appId={appId}>
//         <App />
//       </AppProvider>
//     </ThemeProvider>
//   );
// }
// :state-uncomment-end:
// :state-uncomment-start: prod-graphql
// export default function ProvidedApp() {
//   return (
//     <ThemeProvider>
//       <AppProvider appId={appId}>
//         <App />
//       </AppProvider>
//     </ThemeProvider>
//   );
// }
// :state-uncomment-end:
// :state-uncomment-start: prod-data-api
// const location = { deployment_model: "GLOBAL" };
// export default function ProvidedApp() {
//   return (
//     <ThemeProvider>
//       <DataApiProvider appId={appId} location={location}>
//         <App />
//       </DataApiProvider>
//     </ThemeProvider>
//   );
// }
// :state-uncomment-end:

function App() {
  // :state-start: development
  const { currentUser, logOut } = (API_TYPE_NAME === "Data API" ? useDataApi : useApp)();
  // :state-end:
  // :state-uncomment-start: prod-mql
  // const { currentUser, logOut } = useApp();
  // :state-uncomment-end:
  // :state-uncomment-start: prod-graphql
  // const { currentUser, logOut } = useApp();
  // :state-uncomment-end:
  // :state-uncomment-start: prod-data-api
  // const { currentUser, logOut } = useDataApi();
  // :state-uncomment-end:
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
