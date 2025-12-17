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
import { Platform } from "react-native";

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

const isWeb = Platform.OS === "web";

const setTokenSecure = (key: string, value: string) => {
  if (isWeb) {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }
  return SecureStore.setItemAsync(key, value);
};

const getTokenSecure = (key: string) => {
  if (isWeb) {
    const v = localStorage.getItem(key);
    return Promise.resolve(v);
  }
  return SecureStore.getItemAsync(key);
};

const deleteTokenSecure = (key: string) => {
  if (isWeb) {
    localStorage.removeItem(key);
    return Promise.resolve();
  }
  return SecureStore.deleteItemAsync(key);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AppwriteUser>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const setClientSession = (token: string) => {
    client.setSession(token);
    setToken(token);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const sessionToken = session.secret || session.$id;
      if (!sessionToken) {
        throw new Error("No session token returned from Appwrite");
      }

      // React Native has no cookies; set the session manually on the client.
      setClientSession(sessionToken);
      await setTokenSecure(TOKEN_KEY, sessionToken);

      const currentUser = await account.get();
      setUser(currentUser);
    } catch (err) {
      console.warn("[Auth] login failed", err);
      setUser(null);
      setToken(null);
      await deleteTokenSecure(TOKEN_KEY);
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
      await deleteTokenSecure(TOKEN_KEY);
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
        const storedToken = await getTokenSecure(TOKEN_KEY);
        if (!storedToken) {
          setUser(null);
          setToken(null);
          return;
        }

        setClientSession(storedToken);

        const currentUser = await account.get();
        setUser(currentUser);
      } catch (e) {
        console.warn("[Auth] restoreSession failed", e);
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
