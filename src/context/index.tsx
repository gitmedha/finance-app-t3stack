import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SessionProvider } from "next-auth/react"
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode, }> = ({ children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated}}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an ContextProvider");
  }
  return context;
};
