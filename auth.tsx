import React, { createContext, useContext, useState } from 'react';
import { PublicClientApplication, Configuration, AuthenticationResult } from '@azure/msal-browser';

// MSAL configuration – replace with your own app registration IDs
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID || 'common'}`,
    redirectUri: window.location.origin,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

interface AuthContextType {
  account: AuthenticationResult | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<AuthenticationResult | null>(null);

  const signIn = async () => {
    try {
      const result = await msalInstance.loginPopup({ scopes: ['openid', 'profile'] });
      setAccount(result);
    } catch (err) {
      console.error(err);
    }
  };

  const signOut = async () => {
    if (!account) return;
    await msalInstance.logoutPopup({ account: account.account });
    setAccount(null);
  };

  return (
    <AuthContext.Provider value={{ account, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}