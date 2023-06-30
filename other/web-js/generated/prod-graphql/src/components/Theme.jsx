import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material/styles";
import { colors } from "../colors";

const themeConfig = {
  palette: {
    primary: colors.purple,
    secondary: colors.purple,
  },
}

const theme = createTheme(themeConfig);

export function ThemeProvider({ children }) {
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </StyledEngineProvider>
  );
}
