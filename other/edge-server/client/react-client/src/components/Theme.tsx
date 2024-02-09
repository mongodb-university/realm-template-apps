import React from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
  PaletteColorOptions,
} from "@mui/material/styles";
import { colors } from "../colors";

const themeConfig: ThemeOptions = {
  palette: {
    primary: colors.green,
    secondary: colors.slate,
  },
};

const theme = createTheme(themeConfig);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </StyledEngineProvider>
  );
}
