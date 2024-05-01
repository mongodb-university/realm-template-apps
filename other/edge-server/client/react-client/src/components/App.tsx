import { AppBar, Toolbar, Typography } from "@mui/material";
import { ThemeProvider } from "../providers/ThemeProvider";
import { AuthProvider } from "../providers/AuthProvider";

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
        <Content />
        <MoreInfo />
      </div>
    </AuthProvider>
  );
}
