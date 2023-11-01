import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/auth/Register";
import SignIn from "./pages/auth/SignIn";
import CreateCategory from "./pages/CreateCategory/CreateCategory";
import CreateCard from "./pages/CreateCard/CreateCard";
import Menu from "./pages/Menu.tsx/Menu";
import { useAuthContext } from "./context/authContext";

const PrivateRoutes = () => {
  const { user, loading } = useAuthContext();
  if (loading) {
    return <div> Loading</div>; // Показать состояние загрузки
  }
  return user ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <Navigate to="/sign-in" />
  );
};

const Routing = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/create-category" element={<CreateCategory />} />
        <Route path="/create-card" element={<CreateCard />} />
        <Route path="/menu" element={<Menu />} />
      </Route>
    </Routes>
  );
};

export default Routing;
