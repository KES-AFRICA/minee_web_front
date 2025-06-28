/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";

// Define User type
interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

// Create AuthService
const AuthService = {
  login: async ({ email, password }: { email: string; password: string }): Promise<User> => {
    // Replace with actual API call logic
    console.log("Logging in with", email, password);
    return { id: "1", email };
  },
  logout: () => {
    // Replace with actual logout logic
    console.log("Logging out");
  }
};

interface AuthProviderProps {
  children: ReactNode;
}
export interface AuthContextType {
  currentUser: User | null;
  error: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const user = await AuthService.login({ email, password });
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la connexion");
      setIsAuthenticated(false);
      console.log("[Auth] login error");
    }
    setLoading(false);
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw console.error();
  }

  return context;
};
export default AuthProvider;
