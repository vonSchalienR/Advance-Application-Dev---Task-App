import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { account } from "../appwrite";

type AppwriteUser = {
  $id: string;
  email: string;
} | null;

type AuthContextType = {
  user: AppwriteUser;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AppwriteUser>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password);
    const current = await account.get();
    setUser(current);
  };

  const signup = async (email: string, password: string) => {
    await account.create("unique()", email, password);
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

useEffect(() => {
  const loadUser = async () => {
    try {
      const u = await account.get();
      setUser(u);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  loadUser();
}, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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
