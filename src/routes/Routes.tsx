import React, { Suspense, useCallback } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { parseCookies } from "nookies";
import { Header } from "../components/Header";

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";

export const AppRoutes = (): JSX.Element => {
  const location = useLocation();
  const { "kanbanapp.token": token } = parseCookies();

  const ProtectedRoutes = useCallback(() => {
    if (!token) {
      return <Navigate to={"/login"} />;
    }

    return (
      <>
        <Header />
        <main>
          <Outlet />
        </main>
      </>
    );
  }, [token]);

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
