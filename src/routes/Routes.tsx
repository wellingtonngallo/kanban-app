import React, { Suspense, useCallback } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";

export const AppRoutes = (): JSX.Element => {
  const { user } = useAuth();
  const location = useLocation();

  const ProtectedRoutes = useCallback(() => {
    if (!user.accessToken) {
      return <Navigate to={"/login"} />;
    }

    return (
      <>
        <main>
          <Outlet />
        </main>
      </>
    );
  }, [user.accessToken]);

  return (
    <Suspense fallback={<div>Carregando</div>}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Suspense>
  );
};
