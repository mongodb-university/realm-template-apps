import { ReactNode } from "react";
import { useContext, createContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

import { User } from "../types";

interface AuthContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {},
});

const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const auth = useAuth();

  return (
    <AuthContext.Provider value={{ ...auth, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthProvider };
