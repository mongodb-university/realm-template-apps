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
    <Container
      className="main-container login"
      maxWidth="sm"
    >
      <div>
        <Typography
          component="p"
          variant="h4"
        >
          Log into your Edge Server
        </Typography>
        <Typography component="p">
          This React client connects to your Edge Server through a Node.js
          Express Server. You have two ways to connect: with an email/password
          user or bypassing authentication.
        </Typography>

        <Typography
          component="p"
          variant="h5"
        >
          Use an email/password user.
        </Typography>
        <Typography component="p">
          You must have a user in your App Services App that uses the
          email/authentication auth provider.
        </Typography>

        <Stack
          spacing={2}
          direction="row"
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
        </Stack>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            loginWithEmailPassword({ email, password });
          }}
        >
          Log in
        </Button>

        <Typography
          component="p"
          variant="h5"
        >
          Bypass authentication
        </Typography>
        <Typography component="p">
          If your Edge Server is configured for it, you can bypass
          authentication.
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
      </div>
    </Container>
  );
}
