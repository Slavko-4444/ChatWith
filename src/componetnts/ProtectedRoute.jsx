import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const authToken = Cookies.get("authToken"); // Get the authToken from cookies
  let isAllowed = false;

  if (!authToken) isAllowed = false;
  else {
    const decoded = jwtDecode(authToken);
    if (decoded.id && decoded.userName && decoded.email) {
      isAllowed = true;
      localStorage.setItem("authToken", authToken);
    }
  }

  if (!isAllowed) {
    localStorage.removeItem("authToken");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
