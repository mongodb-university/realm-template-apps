import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { TodoItemsPage } from "./TodoItemsPage";
import { ThemeProvider } from "./Theme";
import "./App.css";

export default function ProvidedApp() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

function App() {
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
      <TodoItemsPage />
    </div>
  );
}
