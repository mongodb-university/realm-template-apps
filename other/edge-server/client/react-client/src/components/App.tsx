import { AppBar, Toolbar, Typography } from "@mui/material";
import { ThemeProvider } from "./Theme";
import { AuthProvider } from "../context/AuthProvider";

import { Content } from "../components/Content";
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
  return (
    <AuthProvider>
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

        <Content />

        <MoreInfo />
      </div>
    </AuthProvider>
  );
}
