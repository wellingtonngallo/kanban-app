import { useContext } from "react";
import { AuthContext, type AuthContextData } from "../context/AuthContext";

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  return context;
};
