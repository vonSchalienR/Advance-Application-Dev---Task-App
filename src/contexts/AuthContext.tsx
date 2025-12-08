import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { ID } from "appwrite";
import { account, client } from "../appwrite";
import * as SecureStore from "expo-secure-store";

type AppwriteUser = {
  $id: string;
  email: string;
} | null;

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  user: AppwriteUser;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

const TOKEN_KEY = "authToken";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AppwriteUser>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const sessionId = session.$id;

      client.setSession(sessionId);
      setToken(sessionId);
      await SecureStore.setItemAsync(TOKEN_KEY, sessionId);

      const currentUser = await account.get();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
      setToken(null);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await account.deleteSession("current");
    } catch (_) {
      // Ignore delete errors to ensure local state is cleared.
    } finally {
      client.setSession("");
      setToken(null);
      setUser(null);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    try {
      await account.create(ID.unique(), email, password);
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      setLoading(true);
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!storedToken) {
          setUser(null);
          setToken(null);
          return;
        }

        client.setSession(storedToken);
        setToken(storedToken);

        const currentUser = await account.get();
        setUser(currentUser);
      } catch (_) {
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        token,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
