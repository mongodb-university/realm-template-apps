import {
  ThemeProvider as MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core";
import { colors } from "../colors";

// :state-start: development
const API_TYPE = process.env.REACT_APP_API_TYPE;
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
  // :state-start: development
  case "local": {
    themeConfig = {
      palette: {
        primary: colors.orange,
        secondary: colors.red,
      },
    };
    break;
  }
  // :state-end:
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

const theme = createMuiTheme(themeConfig);

export function ThemeProvider({ children }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
