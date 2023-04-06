import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material/styles";
import { colors } from "../colors";

// :state-start: development
const API_TYPE = import.meta.env.VITE_API_TYPE;
let themeConfig;
switch (API_TYPE) {
  case "mql": {
    themeConfig = {
      palette: {
        primary: colors.green,
        secondary: colors.green,
      },
    };
    break;
  }
  case "graphql": {
    themeConfig = {
      palette: {
        primary: colors.purple,
        secondary: colors.purple,
      },
    };
    break;
  }
  case "data-api": {
    themeConfig = {
      palette: {
        primary: colors.blue,
        secondary: colors.blue,
      },
    };
    break;
  }
  case "local": {
    themeConfig = {
      palette: {
        primary: colors.orange,
        secondary: colors.red,
      },
    };
    break;
  }
  default: {
    throw new Error(
      `Invalid REACT_APP_API_TYPE: "${API_TYPE}". Specify "graphql", "mql", or "local" instead.`
    );
  }
}
// :state-end:
// :state-uncomment-start: prod-mql
// const themeConfig = {
//   palette: {
//     primary: colors.green,
//     secondary: colors.green,
//   },
// }
// :state-uncomment-end:
// :state-uncomment-start: prod-graphql
// const themeConfig = {
//   palette: {
//     primary: colors.purple,
//     secondary: colors.purple,
//   },
// }
// :state-uncomment-end:
// :state-uncomment-start: prod-data-api
// const themeConfig = {
//   palette: {
//     primary: colors.blue,
//     secondary: colors.blue,
//   }
// }
// :state-uncomment-end:

const theme = createTheme(themeConfig);

export function ThemeProvider({ children }) {
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </StyledEngineProvider>
  );
}
