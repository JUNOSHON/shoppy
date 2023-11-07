import React from "react";
import {Navigate} from "react-router-dom";
import {useAuthContext} from "../context/AuthContext";

export default function ProtectedRoute({children, requiredAdmin}) {
  const {user} = useAuthContext();
  
  if (!user || (requiredAdmin && !user.isAdmin)) {
    return <Navigate to="/" replace/>;
  }
  
  return children;
}
