import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { setCookie, destroyCookie } from "nookies";
import { auth } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";

type UserProps = {
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

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (user) {
        setUser(await formattedUserData(user));
      } else {
        destroyCookie(undefined, "kanbanapp.token");
      }
    });
  }, []);

  const formattedUserData = async (user: User): Promise<UserProps> => {
    return {
      displayName: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
    };
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();

    try {
      const { user } = await signInWithPopup(auth, provider);

      setUser(await formattedUserData(user));
      setCookie(
        undefined,
        "kanbanapp.token",
        (await user.getIdTokenResult()).token,
      );

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
