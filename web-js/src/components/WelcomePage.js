import React from "react";
import * as Realm from "realm-web";
import {
  Container,
  TextField,
  Button,
  IconButton,
  Card,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import { useRealmApp } from "./RealmApp";
import { MoreInfoTemplateAndDocs } from './MoreInfo'
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { toggleBoolean } from "../utils";



export function WelcomePage() {
  const realmApp = useRealmApp();
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
  };
  const [error, setError] = React.useState(noErrors);
  const clearErrors = () => setError(noErrors);
  // Manage password visibility
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => setShowPassword(toggleBoolean);

  const onFormSubmit = async ({ email, password }) => {
    clearErrors();
    try {
      if (isSignup) {
        await realmApp.emailPasswordAuth.registerUser(email, password);
      }
      await realmApp.logIn(Realm.Credentials.emailPassword(email, password));
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
            function getFormValues(htmlFormElement) {
              const formData = new FormData(htmlFormElement);
              return Object.fromEntries(formData.entries());
            }
            const { email, password } = getFormValues(e.target);
            onFormSubmit({ email, password });
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            {isSignup ? "Sign Up" : "Log In"}
          </Typography>
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
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button type="submit" variant="contained" color="primary">
            {isSignup ? "Create Account" : "Log In"}
          </Button>
          <button
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
  const { error, statusCode } = err
  const errorType = error || statusCode;
  switch (errorType) {
    case "invalid username":
      setError((prevErr) => ({ ...prevErr, email: "Invalid email address." }));
      break;
    case "invalid username/password":
    case "invalid password":
    case 401:
      setError((err) => ({ ...err, password: "Incorrect password." }));
      break;
    case "name already in use":
    case 409:
      setError((err) => ({ ...err, email: "Email is already registered." }));
      break;
    case "password must be between 6 and 128 characters":
    case 400:
      setError((err) => ({
        ...err,
        password: "Password must be between 6 and 128 characters.",
      }));
      break;
    default:
      break;
  }
}
