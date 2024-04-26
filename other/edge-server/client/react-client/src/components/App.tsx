import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ThemeProvider } from "./Theme";

import { LoginPage } from "./LoginPage";
import { TodoItemsPage } from "./TodoItemsPage";
import { MoreInfo } from "./MoreInfo";

import "./App.css";

export default function ProvidedApp() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            className="app-bar-title"
            component="h1"
            variant="h5"
          >
            Edge Server Wire Protocol App
          </Typography>
        </Toolbar>
      </AppBar>
      {/* TODO: If not logged in, show auth page. */}
      {loggedIn ? <TodoItemsPage /> : <LoginPage setLoggedIn={setLoggedIn} />}

      <MoreInfo />
    </div>
  );
}
