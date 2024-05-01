import { ReactNode } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
} from "@mui/material/styles";
import { colors } from "../colors";

const themeConfig: ThemeOptions = {
  palette: {
    primary: colors.green,
    secondary: colors.mist,
  },
};

const theme = createTheme(themeConfig);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </StyledEngineProvider>
  );
}
