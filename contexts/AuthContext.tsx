import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from "react";
import { auth } from "../firebase";
import firebase from "firebase/app";

const AuthContext = React.createContext({});

export function useAuth(): any {
  return useContext(AuthContext);
}

export enum OAuthType {
  Google,
  Microsoft,
  Github,
}

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>();
  const [loading, setLoading] = useState(true);

  const signUp = (email: string, password: string) => {
    // Change auth here to switch from firebase to other provider :P
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const login = (email: string, password: string) => {
    // Change auth here to switch from firebase to other provider :P
    return auth.signInWithEmailAndPassword(email, password);
  };

  const loginOAuth = (oauth: OAuthType) => {
    let provider;
    switch (oauth) {
      case OAuthType.Google:
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case OAuthType.Microsoft:
        provider = new firebase.auth.OAuthProvider("microsoft.com");
        break;
      case OAuthType.Github:
        provider = new firebase.auth.GithubAuthProvider();
    }
    return auth.signInWithPopup(provider);
  };

  const loginAnonymous = () => {
    return auth.signInAnonymously();
  };

  const logout = () => {
    return auth.signOut();
  };

  const resetPassword = (email: string) => {
    return auth.sendPasswordResetEmail(email);
  };

  const updateEmail = (email: string) => {
    return auth.currentUser?.updateEmail(email);
  };

  const updatePassword = (password: string) => {
    return auth.currentUser?.updatePassword(password);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signUp,
    login,
    loginOAuth,
    loginAnonymous,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
