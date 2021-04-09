import React from "react";
import * as Realm from "realm-web"
import logo from '../logo.svg';
import { Container, TextField, Button } from "@material-ui/core";

const app = new Realm.App("todo-sync")

export function WelcomePage(props) {
  const [isSignup, setIsSignup] = React.useState(false);
  const toggle = () => setIsSignup(s => !s)
  const onFormSubmit = async ({ email, password }) => {
    if(isSignup) {
      await app.emailPasswordAuth.registerUser(email, password);
    } else {
      await app.logIn(Realm.Credentials.emailPassword(email, password))
    }
  }
  
  return (
    <Container maxWidth="md">
      <h1>
        <img src={logo} className="App-logo" alt="logo" />
        My GraphQL App
      </h1>
      <div>{props.children}</div>
      <h2>{isSignup ? "Create an Account" : "Log In"}</h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const { email, password } = getFormValues(e.target);
        onFormSubmit({ email, password });
      }}>
        <TextField id="input-email" name="email" label="Email Address" variant="outlined" />
        <TextField id="input-password" name="password" label="Password" variant="outlined" />
        <Button type="submit">asdf</Button>
      </form>
      <button className="link-button" onClick={() => toggle()}>{isSignup ? "Already have an account? Log In" : "Sign up for an account"}</button>
    </Container>
  );
}

function getFormValues(htmlFormElement) {
  const formData = new FormData(htmlFormElement);
  return Object.fromEntries(formData.entries());
}
