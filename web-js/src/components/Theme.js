import {
  ThemeProvider as MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core";
import { green, purple, orange, red } from "@material-ui/core/colors";

const API_TYPE = process.env.REACT_APP_API_TYPE;

const customGreen = {
  ...green,
  500: "#09804C",
  A400: "#B9EACD",
}

const customPurple = {
  ...purple,
  500: "#6200EE",
  A400: "#9795F9",
}

let themeConfig;
switch (API_TYPE) {
  case "mql": {
    themeConfig = {
      palette: {
        primary: customGreen,
        secondary: customGreen,
      },
    };
    break;
  }
  case "graphql": {
    themeConfig = {
      palette: {
        primary: customPurple,
        secondary: customPurple,
      },
    };
    break;
  }
  case "local": {
    themeConfig = {
      palette: {
        primary: orange,
        secondary: red,
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
const theme = createMuiTheme(themeConfig);

export function ThemeProvider({ children }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
