import { login } from "../endpoints";

export function useAuth() {
  const loginNoAuth = async () => {
    await login();
  };

  const loginWithEmailPassword = async (user: {
    email: string;
    password: string;
  }) => {
    await login(user);
  };

  return {
    loginNoAuth,
    loginWithEmailPassword,
  };
}
