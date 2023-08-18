import React, { createContext, useState, type ReactNode } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

type UserProps = {
  accessToken: string;
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
};

export type AuthContextData = {
  user: UserProps;
  handleGoogleSignIn: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState({} as UserProps);
  const navigate = useNavigate();

  const handleGoogleSignIn = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();

    try {
      const { user } = await signInWithPopup(auth, provider);
      const formattedUserData = {
        accessToken: (await user.getIdTokenResult()).token,
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
      };

      setUser(formattedUserData);

      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, handleGoogleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};
