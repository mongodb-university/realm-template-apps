import React from "react";
import {
  Container,
  TextField,
  Button,
  IconButton,
  Card,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Link, useHistory } from 'react-router-dom';
import useRealmApp from '../hooks/useRealmApp';

export function WelcomePage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSignup, setIsSignup] = React.useState(false);

  const { logIn, signUp } = useRealmApp();
  const history = useHistory();

  const toggleIsSignup = () => setIsSignup(!isSignup);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const onFormSubmit = async ({ email, password }) => {
    console.log('form submitted')
    try {
      if (isSignup) {
        console.log('sign up attempt');
        const signUpResults = await signUp(email, password);
        //checks if the response is an Error
        if (signUpResults) {
          history.push('/todo');
        } else {
          console.log(`An error occurred logging in`);
        }
      }else{
        console.log('log in attempt');
        const logInResults = await logIn(email, password);
        //checks if the response is an Error
        if (logInResults) {
          history.push('/todo');
        }else{
          console.log(`An error occurred logging in`);
        }
      }
    } catch (err) {
      console.log('An error occurred with form submission', err);
      // handleAuthenticationError(err, setError);
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
          <Typography component="h2" variant="h4" gutterBottom>
            {isSignup ? "Sign Up" : "Log In"}
          </Typography>
          <TextField
            id="input-email"
            name="email"
            label="Email Address"
            variant="outlined"
          />
          <br />
          <TextField
            id="input-password"
            type={showPassword ? "text" : "password"}
            name="password"
            label="Password"
            variant="outlined"
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
              ),
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
              : "Don't have an account? Create an Account"}
          </button>
        </form>
      </Card>
    </Container>
  );
}