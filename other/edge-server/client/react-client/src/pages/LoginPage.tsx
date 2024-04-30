import React from "react";
import {
  Container,
  Button,
  Typography,
  TextField,
  Stack,
  OutlinedInput,
  InputAdornment,
  IconButton,
  InputLabel,
  FormControl,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const { loginNoAuth, loginWithEmailPassword } = useAuth();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Container className="login-page">
      <Typography
        component="h2"
        variant="h4"
        gutterBottom
      >
        Log into your Edge Server
      </Typography>
      <Typography component="p">
        This React client connects to your Edge Server through a Node.js Express
        Server. You have two ways to connect: with an email/password user or
        bypassing authentication.
      </Typography>

      <Typography
        component="h3"
        variant="h5"
        gutterBottom
      >
        Use an email/password user
      </Typography>
      <Typography component="p">
        You must have a user in your App Services App that uses the
        email/authentication auth provider.
      </Typography>

      <Stack
        spacing={2}
        direction="column"
        className="input-row"
      >
        <TextField
          id="login-email"
          label="Email"
          variant="outlined"
          onChange={(event) => setEmail(event?.target.value)}
        />
        <FormControl
          sx={{ m: 1, width: "25ch" }}
          variant="outlined"
        >
          <InputLabel htmlFor="login-password">Password</InputLabel>
          <OutlinedInput
            id="login-password"
            label="password"
            onChange={(event) => setPassword(event?.target.value)}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            loginWithEmailPassword({ email, password });
          }}
          className="login-button"
        >
          Log in
        </Button>
      </Stack>

      <Typography
        component="h3"
        variant="h5"
        gutterBottom
      >
        Bypass authentication
      </Typography>
      <Typography component="p">
        If your Edge Server is configured for it, you can bypass authentication.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          loginNoAuth();
        }}
      >
        Bypass authentication
      </Button>
    </Container>
  );
}
