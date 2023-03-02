import React from "react";
// :state-start: prod-mql prod-graphql
import * as Realm from "realm-web";
// :state-end:
import {
  Container,
  TextField,
  Button,
  IconButton,
  Card,
  Typography,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// :state-start: development
import { useApp } from "./RealmApp";
// :state-end:
// :state-uncomment-start: prod-mql
// import { useApp } from "./RealmApp";
// :state-uncomment-end:
// :state-uncomment-start: prod-graphql
// import { useApp } from "./RealmApp";
// :state-uncomment-end:
// :state-start: prod-data-api
import { useDataApi } from "../hooks/useDataApi";
import { ClientApiError } from "../client-api";
// :state-end:
import { MoreInfoTemplateAndDocs } from "./MoreInfo";
import { toggleBoolean } from "../utils";
import { useErrorAlert } from "../hooks/useErrorAlert";
// :state-start: development
import { API_TYPE_NAME } from "../components/AppName";
const useAppServices = API_TYPE_NAME === "Data API" ? useDataApi : useApp;
// :state-end:

export function WelcomePage() {
  // :state-start: development
  const app = useAppServices();
  // :state-end:
  // :state-uncomment-start: prod-mql
  // const app = useApp();
  // :state-uncomment-end:
  // :state-uncomment-start: prod-graphql
  // const app = useApp();
  // :state-uncomment-end:
  // :state-uncomment-start: prod-data-api
  // const app = useDataApi();
  // :state-uncomment-end:

  // Track whether the user is logging in or signing up for a new account
  const [isSignup, setIsSignup] = React.useState(false);
  const toggleIsSignup = () => {
    clearErrors();
    setIsSignup(toggleBoolean);
  };
  // Authentication errors
  const noErrors = {
    email: null,
    password: null,
    other: null,
  };
  const [error, setError] = React.useState(noErrors);
  const clearErrors = () => setError(noErrors);
  const NonAuthErrorAlert = useErrorAlert({
    error: error.other,
    clearError: () => {
      setError((prevError) => ({ ...prevError, other: null }));
    },
  });
  // Manage password visibility
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => setShowPassword(toggleBoolean);

  const onFormSubmit = async ({ email, password }) => {
    clearErrors();
    try {
      if (isSignup) {
        await app.emailPasswordAuth.registerUser({ email, password });
      }
      // :state-start: development
      if (API_TYPE_NAME === "Data API") {
        await app.logIn("local-userpass", { email, password });
      } else {
        await app.logIn(Realm.Credentials.emailPassword(email, password));
      }
      // :state-end:
      // :state-uncomment-start: prod-mql
      // await app.logIn(Realm.Credentials.emailPassword(email, password));
      // :state-uncomment-end:
      // :state-uncomment-start: prod-graphql
      // await app.logIn(Realm.Credentials.emailPassword(email, password));
      // :state-uncomment-end:
      // :state-uncomment-start: prod-data-api
      // await app.logIn("local-userpass", { email, password });
      // :state-uncomment-end:
    } catch (err) {
      handleAuthenticationError(err, setError);
    }
  };

  return (
    <Container maxWidth="sm" className="main-container">
      <Card className="auth-card" variant="outlined">
        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const { email, password } = Object.fromEntries(formData.entries());
            onFormSubmit({ email, password });
          }}
        >
          <Typography component="h2" variant="h4">
            Welcome!
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {isSignup
              ? "Enter your email and a password to create a new account."
              : "Enter your email and a password to log in with an existing account."}
          </Typography>
          <NonAuthErrorAlert />
          <TextField
            id="input-email"
            data-testid="input-email"
            name="email"
            label="Email Address"
            variant="outlined"
            error={Boolean(error.email)}
            helperText={error.email ?? ""}
          />
          <TextField
            id="input-password"
            data-testid="input-password"
            type={showPassword ? "text" : "password"}
            name="password"
            label="Password"
            variant="outlined"
            error={Boolean(error.password)}
            helperText={error.password ?? ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            id="submit-button"
            data-testid="submit-button"
            type="submit"
            variant="contained"
            color="primary"
          >
            {isSignup ? "Create Account" : "Log In"}
          </Button>
          <button
            id="toggle-auth-type-button"
            type="button"
            className="link-button"
            onClick={() => toggleIsSignup()}
          >
            {isSignup
              ? "Already have an account? Log In"
              : "Sign up for an account"}
          </button>
        </form>
      </Card>
      <MoreInfoTemplateAndDocs />
    </Container>
  );
}

function handleAuthenticationError(err, setError) {
  const handleUnknownError = () => {
    setError((prevError) => ({
      ...prevError,
      other: "Something went wrong. Try again in a little bit.",
    }));
    console.warn(
      "Something went wrong with a login or signup request. See the following error for details."
    );
    console.error(err);
  };
  // :state-start: development
  if (err instanceof Realm.MongoDBRealmError || err instanceof ClientApiError) {
    const { error, message, statusCode, status_code } = err;
    const errorType = error || message || statusCode || status_code;
  // :state-end:
  // :state-uncomment-start: prod-mql
  // if (err instanceof Realm.MongoDBRealmError) {
  //   const { error, statusCode } = err;
  //   const errorType = error || statusCode;
  // :state-uncomment-end:
  // :state-uncomment-start: prod-graphql
  // if (err instanceof Realm.MongoDBRealmError) {
  //   const { error, statusCode } = err;
  //   const errorType = error || statusCode;
  // :state-uncomment-end:
  // :state-uncomment-start: prod-data-api
  // if (err instanceof ClientApiError) {
  //   const { error, status_code } = err;
  //   const errorType = error || status_code;
  // :state-uncomment-end:
    switch (errorType) {
      case "invalid username":
      case "email invalid":
        setError((prevError) => ({
          ...prevError,
          email: "Invalid email address.",
        }));
        break;
      case "invalid username/password":
      case "invalid password":
      case 401:
        setError((prevError) => ({
          ...prevError,
          password: "Incorrect password.",
        }));
        break;
      case "name already in use":
      case 409:
        setError((prevError) => ({
          ...prevError,
          email: "Email is already registered.",
        }));
        break;
      case "password must be between 6 and 128 characters":
      case 400:
        setError((prevError) => ({
          ...prevError,
          password: "Password must be between 6 and 128 characters.",
        }));
        break;
      default:
        handleUnknownError();
        break;
    }
  } else {
    handleUnknownError();
  }
}
