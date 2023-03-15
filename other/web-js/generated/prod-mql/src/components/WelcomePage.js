import React from "react";
import * as Realm from "realm-web";
import { useApp } from "./RealmApp";
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
import { MoreInfoDocsLink } from "./MoreInfo";
import { toggleBoolean } from "../utils";
import { useErrorAlert } from "../hooks/useErrorAlert";

export function WelcomePage() {
  const app = useApp();

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
      await app.logIn(Realm.Credentials.emailPassword(email, password));
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
      <MoreInfoDocsLink />
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
  if (err instanceof Realm.MongoDBRealmError) {
    const { error, statusCode } = err;
    const errorType = error || statusCode;
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
